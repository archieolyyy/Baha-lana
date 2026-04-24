# SMS + OTP Setup (Twilio)

## 1) Install Firebase CLI and login

```bash
npm install -g firebase-tools
firebase login
```

## 2) Initialize project binding

Run in the project root and select your Firebase project:

```bash
firebase use --add
```

## 3) Install Cloud Function dependencies

```bash
cd functions
npm install
```

## 4) Configure function secrets

From the project root:

```bash
firebase functions:secrets:set TWILIO_ACCOUNT_SID
firebase functions:secrets:set TWILIO_AUTH_TOKEN
firebase functions:secrets:set TWILIO_FROM_NUMBER
firebase functions:secrets:set OTP_SECRET
```

Use:
- `TWILIO_ACCOUNT_SID`: Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Twilio Auth Token
- `TWILIO_FROM_NUMBER`: Twilio sender number (E.164 format, e.g. `+1...`)
- `OTP_SECRET`: random long secret string used to hash OTP codes

## 5) Ensure app env values are set

In `.env`:

- `EXPO_PUBLIC_FIREBASE_DATABASE_URL=...`
- `EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION=asia-southeast1`

## 6) Deploy functions

```bash
firebase deploy --only functions
```

## 7) Firestore indexes (if prompted)

`sendFloodSmsAlerts` queries:
- `users` where `phoneVerified == true` and `smsAlertsEnabled == true`

If Firebase asks for an index, create it in the Firebase Console and redeploy.

## Notes

- OTP codes expire in 5 minutes.
- OTP max attempts: 5.
- SMS cooldown for flood alerts: 30 minutes unless level increases.
- Warning threshold: `>= 4.5 cm`, Danger threshold: `>= 9.0 cm`.
