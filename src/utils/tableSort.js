export const compareNumericValues = (valueA, valueB) => {
  const numberA = Number(String(valueA ?? "").replace(/[^\d.-]/g, ""));
  const numberB = Number(String(valueB ?? "").replace(/[^\d.-]/g, ""));

  if (!Number.isFinite(numberA)) return Number.isFinite(numberB) ? -1 : 0;
  if (!Number.isFinite(numberB)) return 1;
  return numberA - numberB;
};

export const compareFormattedDates = (valueA, valueB) => {
  const parseDate = (value) => {
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(String(value ?? ""));
    if (!match) return Number.NaN;

    const [, month, day, year] = match;
    return Date.UTC(Number(year), Number(month) - 1, Number(day));
  };

  const dateA = parseDate(valueA);
  const dateB = parseDate(valueB);
  if (!Number.isFinite(dateA)) return Number.isFinite(dateB) ? -1 : 0;
  if (!Number.isFinite(dateB)) return 1;
  return dateA - dateB;
};
