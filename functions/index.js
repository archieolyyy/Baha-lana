const crypto = require('node:crypto');
const admin = require('firebase-admin');
const twilio = require('twilio');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onValueWritten } = require('firebase-functions/v2/database');
const { defineSecret } = require('firebase-functions/params');

admin.initializeApp();

const db = admin.firestore();

const OTP_SECRET = defineSecret('OTP_SECRET');
const TWILIO_ACCOUNT_SID = defineSecret('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = defineSecret('TWILIO_AUTH_TOKEN');
const TWILIO_FROM_NUMBER = defineSecret('TWILIO_FROM_NUMBER');

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const SMS_COOLDOWN_MS = 30 * 60 * 1000;
const WARNING_CM = 4.5;
const DANGER_CM = 9.0;

const hashOtp = (phoneE164, otpCode, secret) =>
  crypto.createHash('sha256').update(`${phoneE164}:${otpCode}:${secret}`).digest('hex');

const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const levelForCm = (cm) => {
  if (cm >= DANGER_CM) return 3;
  if (cm >= WARNING_CM) return 2;
  return 1;
};

const buildAlertMessage = ({ level, cm }) => {
  const now = new Date().toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    hour12: true,
  });
  if (level === 3) {
    return `BAHA-LANA ALERT: DANGER water level detected (${cm.toFixed(
      1,
    )} cm) as of ${now}. Move to a safer area immediately.`;
  }
  return `BAHA-LANA WARNING: Rising water level detected (${cm.toFixed(
    1,
  )} cm) as of ${now}. Stay alert and prepare to evacuate if needed.`;
};

const sendTwilioSms = async ({ accountSid, authToken, from, to, message }) => {
  const client = twilio(accountSid, authToken);
  return client.messages.create({
    body: message,
    from,
    to,
  });
};

exports.sendPhoneVerificationOtp = onCall(
  {
    region: 'asia-southeast1',
    secrets: [OTP_SECRET, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER],
  },
  async (request) => {
    if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in first.');
    const phoneE164 = String(request.data?.phoneE164 || '').trim();
    if (!/^\+639\d{9}$/.test(phoneE164)) {
      throw new HttpsError('invalid-argument', 'Invalid PH phone format.');
    }

    const otpCode = generateOtp();
    const hash = hashOtp(phoneE164, otpCode, OTP_SECRET.value());
    const now = Date.now();

    await db.collection('phoneVerifications').doc(request.auth.uid).set(
      {
        phoneE164,
        otpHash: hash,
        requestedAtMs: now,
        expiresAtMs: now + OTP_TTL_MS,
        attempts: 0,
      },
      { merge: true },
    );

    await sendTwilioSms({
      accountSid: TWILIO_ACCOUNT_SID.value(),
      authToken: TWILIO_AUTH_TOKEN.value(),
      from: TWILIO_FROM_NUMBER.value(),
      to: phoneE164,
      message: `Your BAHA-LANA verification code is ${otpCode}. It expires in 5 minutes.`,
    });

    return { ok: true };
  },
);

exports.verifyPhoneVerificationOtp = onCall(
  {
    region: 'asia-southeast1',
    secrets: [OTP_SECRET],
  },
  async (request) => {
    if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in first.');
    const phoneE164 = String(request.data?.phoneE164 || '').trim();
    const otpCode = String(request.data?.otpCode || '').trim();
    if (!/^\+639\d{9}$/.test(phoneE164) || !/^\d{6}$/.test(otpCode)) {
      throw new HttpsError('invalid-argument', 'Invalid verification payload.');
    }

    const ref = db.collection('phoneVerifications').doc(request.auth.uid);
    const snap = await ref.get();
    if (!snap.exists) {
      throw new HttpsError('failed-precondition', 'No OTP request found. Please request a new code.');
    }

    const data = snap.data();
    const now = Date.now();
    if (data.phoneE164 !== phoneE164) {
      throw new HttpsError('failed-precondition', 'OTP is for a different number. Request again.');
    }
    if (now > Number(data.expiresAtMs || 0)) {
      throw new HttpsError('deadline-exceeded', 'OTP has expired. Request a new one.');
    }
    if (Number(data.attempts || 0) >= OTP_MAX_ATTEMPTS) {
      throw new HttpsError('resource-exhausted', 'Too many attempts. Request a new OTP.');
    }

    const incomingHash = hashOtp(phoneE164, otpCode, OTP_SECRET.value());
    if (incomingHash !== data.otpHash) {
      await ref.set({ attempts: admin.firestore.FieldValue.increment(1) }, { merge: true });
      throw new HttpsError('permission-denied', 'Invalid OTP code.');
    }

    await db.collection('users').doc(request.auth.uid).set(
      {
        phoneE164,
        phoneVerified: true,
        phoneVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    await ref.delete();
    return { ok: true };
  },
);

exports.sendFloodSmsAlerts = onValueWritten(
  {
    ref: '/sensor/cm',
    region: 'asia-southeast1',
    secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER],
  },
  async (event) => {
    const nextCm = Number(event.data.after.val());
    if (!Number.isFinite(nextCm)) return null;

    const level = levelForCm(nextCm);
    if (level < 2) return null;

    const stateRef = db.collection('system').doc('alertState');
    const stateSnap = await stateRef.get();
    const state = stateSnap.exists ? stateSnap.data() : {};
    const now = Date.now();

    const lastLevel = Number(state.lastLevel || 1);
    const lastSentAtMs = Number(state.lastSentAtMs || 0);
    const shouldSend = level > lastLevel || now - lastSentAtMs >= SMS_COOLDOWN_MS;

    if (!shouldSend) return null;

    const usersSnap = await db
      .collection('users')
      .where('phoneVerified', '==', true)
      .where('smsAlertsEnabled', '==', true)
      .get();

    if (usersSnap.empty) {
      await stateRef.set(
        {
          lastLevel: level,
          lastCm: nextCm,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      return null;
    }

    const message = buildAlertMessage({ level, cm: nextCm });
    const accountSid = TWILIO_ACCOUNT_SID.value();
    const authToken = TWILIO_AUTH_TOKEN.value();
    const from = TWILIO_FROM_NUMBER.value();
    const sendTasks = [];
    const logs = [];

    usersSnap.forEach((docSnap) => {
      const user = docSnap.data();
      if (!/^\+639\d{9}$/.test(user.phoneE164 || '')) return;
      sendTasks.push(
        sendTwilioSms({
          accountSid,
          authToken,
          from,
          to: user.phoneE164,
          message,
        })
          .then((res) => {
            logs.push({
              uid: docSnap.id,
              phoneE164: user.phoneE164,
              status: 'sent',
              providerId: res.sid,
            });
          })
          .catch((err) => {
            logs.push({
              uid: docSnap.id,
              phoneE164: user.phoneE164,
              status: 'failed',
              reason: err.message,
            });
          }),
      );
    });

    await Promise.all(sendTasks);

    const batch = db.batch();
    const logRef = db.collection('smsDispatchLogs').doc();
    batch.set(logRef, {
      level,
      cm: nextCm,
      message,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      recipients: logs,
    });
    batch.set(
      stateRef,
      {
        lastLevel: level,
        lastCm: nextCm,
        lastSentAtMs: now,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    await batch.commit();

    return null;
  },
);
