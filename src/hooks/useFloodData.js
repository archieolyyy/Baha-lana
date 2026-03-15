import { useState, useEffect, useCallback } from 'react';
import { getLevelForCm, cmToPercent } from '../constants/floodLevels';

/**
 * Mock data hook — replace internals with Firebase
 * realtime listener once backend is connected.
 */

const MOCK_CURRENT_CM = 45;

const generateWeeklyData = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  return days.map((day, i) => ({
    day,
    cm: i <= today ? Math.floor(Math.random() * 100) + 10 : 0,
    isToday: i === today,
  }));
};

const generateHistory = () => {
  const entries = [];
  const now = Date.now();
  for (let i = 0; i < 15; i++) {
    const cm = Math.floor(Math.random() * 160) + 10;
    const level = getLevelForCm(cm);
    entries.push({
      id: `h${i}`,
      timestamp: now - i * 3600000 * (3 + Math.random() * 5),
      cm,
      percent: cmToPercent(cm),
      level,
    });
  }
  return entries.sort((a, b) => b.timestamp - a.timestamp);
};

const generateAlerts = () => {
  const types = [
    { cm: 165, msg: 'Water level reached OVERFLOW. Evacuate immediately!' },
    { cm: 145, msg: 'Water level is CRITICAL. Prepare for evacuation.' },
    { cm: 100, msg: 'Water rising — Medium warning issued.' },
    { cm: 50, msg: 'Water level is low. Conditions are safe.' },
    { cm: 155, msg: 'Water level approaching OVERFLOW threshold.' },
    { cm: 92, msg: 'Yellow warning — water has surpassed 90 cm.' },
  ];
  const now = Date.now();
  return types.map((t, i) => ({
    id: `a${i}`,
    timestamp: now - i * 7200000,
    cm: t.cm,
    percent: cmToPercent(t.cm),
    level: getLevelForCm(t.cm),
    message: t.msg,
    read: i > 2,
  }));
};

export const useFloodData = () => {
  const [currentCm, setCurrentCm] = useState(MOCK_CURRENT_CM);
  const [weeklyData, setWeeklyData] = useState([]);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setWeeklyData(generateWeeklyData());
      setHistory(generateHistory());
      setAlerts(generateAlerts());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const currentLevel = getLevelForCm(currentCm);
  const currentPercent = cmToPercent(currentCm);

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const newCm = Math.floor(Math.random() * 150) + 10;
      setCurrentCm(newCm);
      setWeeklyData(generateWeeklyData());
      setHistory(generateHistory());
      setAlerts(generateAlerts());
      setLoading(false);
    }, 600);
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
