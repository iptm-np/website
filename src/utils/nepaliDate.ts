import NepaliDate, { dateConfigMap } from "nepali-date-converter";

export const BS_MONTH_NAMES = [
  "Baisakh",
  "Jestha",
  "Asar",
  "Shrawan",
  "Bhadra",
  "Aswin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
] as const;

export interface BsDateParts {
  year: number;
  month: number;
  day: number;
}

export const BS_YEARS = Object.keys(dateConfigMap)
  .map(Number)
  .sort((a, b) => a - b);

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseAdDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

const firstSupportedDate = toDateKey(new NepaliDate(BS_YEARS[0], 0, 1).toJsDate());
const lastYear = BS_YEARS[BS_YEARS.length - 1];
const lastMonth = BS_MONTH_NAMES.length - 1;
const lastSupportedDate = toDateKey(
  new NepaliDate(
    lastYear,
    lastMonth,
    dateConfigMap[String(lastYear)][BS_MONTH_NAMES[lastMonth]],
  ).toJsDate(),
);

export function getDaysInBSMonth(year: number, month: number) {
  const monthName = BS_MONTH_NAMES[month];
  return monthName ? dateConfigMap[String(year)]?.[monthName] || 0 : 0;
}

export function getBSDateParts(value: string): BsDateParts | null {
  const date = parseAdDate(value);
  if (!date) return null;

  const dateKey = toDateKey(date);
  if (dateKey < firstSupportedDate || dateKey > lastSupportedDate) return null;

  const bsDate = NepaliDate.fromAD(date).getBS();
  if (!dateConfigMap[String(bsDate.year)]) return null;

  return { year: bsDate.year, month: bsDate.month, day: bsDate.date };
}

export function toADDateKey({ year, month, day }: BsDateParts) {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  const daysInMonth = getDaysInBSMonth(year, month);
  if (!daysInMonth || day < 1 || day > daysInMonth) return null;

  const date = new NepaliDate(year, month, day).toJsDate();
  const adDateKey = toDateKey(date);
  const convertedBack = getBSDateParts(adDateKey);

  if (
    !convertedBack ||
    convertedBack.year !== year ||
    convertedBack.month !== month ||
    convertedBack.day !== day
  ) {
    return null;
  }

  return adDateKey;
}

export function isValidADDateKey(value: string) {
  return parseAdDate(value) !== null;
}

export function formatBSDate(value: string) {
  const dateKey = /^(\d{4}-\d{2}-\d{2})(?:T.*)?$/.exec(value)?.[1];
  const bsDate = dateKey ? getBSDateParts(dateKey) : null;

  if (!bsDate) return value;

  return `${bsDate.day} ${BS_MONTH_NAMES[bsDate.month]} ${bsDate.year}`;
}
