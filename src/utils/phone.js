const DIGITS = (s) => String(s || '').replace(/\D/g, '');

export const normalizePhilippinesPhone = (input) => {
  const d = DIGITS(input);
  if (d.length === 13 && d.startsWith('63')) return `+${d}`;
  if (d.length === 12 && d.startsWith('63')) return `+${d}`;
  if (d.length === 11 && d.startsWith('09')) return `+63${d.slice(1)}`;
  if (d.length === 10 && d.startsWith('9')) return `+63${d}`;
  if (d.length === 12 && d.startsWith('639')) return `+${d}`;
  return null;
};

export const formatPhoneDisplay = (e164) => {
  if (!e164 || !e164.startsWith('+63')) return e164 || '';
  const rest = e164.slice(3);
  if (rest.length === 10) {
    return `+63 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }
  return e164;
};

export const isValidPhilippinesMobile = (e164) => {
  if (!e164 || !e164.startsWith('+63')) return false;
  const n = e164.slice(3);
  return n.length === 10 && n.startsWith('9');
};
