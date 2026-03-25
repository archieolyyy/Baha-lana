import { useState, useEffect, useCallback } from 'react';
import { onValue, query, limitToLast } from 'firebase/database';
import { getLevelForCm, cmToPercent } from '../constants/floodLevels';
import { sensorRef, historyRef } from '../services/firebase';

const messageForCm = (cm) => {
  const level = getLevelForCm(cm);
  if (level.level >= 3) return 'Danger: water level is high.';
  if (level.level >= 2) return 'Warning: water level is rising.';
  return 'Water level update received.';
};

export const useFloodData = () => {
  const [currentCm, setCurrentCm] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = sensorRef();
    if (!ref) {
      setLoading(false);
      return;
    }

    const unsub = onValue(
      ref,
      (snap) => {
        const data = snap.val();
        const cm = typeof data?.cm === 'number' ? data.cm : 0;
        setCurrentCm(cm);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const ref = historyRef();
    if (!ref) return undefined;

    const q = query(ref, limitToLast(80));
    const unsub = onValue(
      q,
      (snap) => {
        const value = snap.val() || {};
        const items = Object.entries(value)
          .map(([id, row]) => {
            const cm = Number(row?.cm);
            const timestamp = Number(row?.updatedAt ?? row?.timestamp) || Date.now();
            if (Number.isNaN(cm)) return null;
            return {
              id,
              cm,
              timestamp,
              percent: cmToPercent(cm),
              level: getLevelForCm(cm),
            };
          })
          .filter(Boolean)
          .sort((a, b) => b.timestamp - a.timestamp);

        setHistory(items);

        const latestAlerts = items
          .filter((x) => x.level.level >= 3)
          .slice(0, 20)
          .map((x, i) => ({
            id: `a-${x.id}`,
            timestamp: x.timestamp,
            cm: x.cm,
            percent: x.percent,
            level: x.level,
            message: messageForCm(x.cm),
            read: i > 2,
          }));
        setAlerts(latestAlerts);

        const byDay = new Map();
        for (const x of items) {
          const d = new Date(x.timestamp);
          const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          if (!byDay.has(key)) byDay.set(key, []);
          byDay.get(key).push(x.cm);
        }
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekly = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          const arr = byDay.get(key) || [];
          const avg = arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
          weekly.push({
            day: days[d.getDay()],
            cm: avg,
            isToday: i === 0,
          });
        }
        setWeeklyData(weekly);
      },
      () => {
        setHistory([]);
      }
    );

    return () => unsub();
  }, []);

  const currentLevel = getLevelForCm(currentCm);
  const currentPercent = cmToPercent(currentCm);

  const refresh = useCallback(() => {
    // Live data is pushed by Firebase listener; no mock refresh.
  }, []);

  return {
    currentCm,
    currentPercent,
    currentLevel,
    weeklyData,
    history,
    alerts,
    loading,
    refresh,
  };
};
