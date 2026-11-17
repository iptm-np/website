import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  BS_MONTH_NAMES,
  BS_YEARS,
  BsDateParts,
  getBSDateParts,
  getDaysInBSMonth,
  toADDateKey,
} from "../../../utils/nepaliDate";

interface BSDatePickerProps {
  id: string;
  label: string;
  value: string;
  ariaInvalid?: boolean;
  onChange: (value: string) => void;
}

const emptyDate: BsDateParts = { year: 0, month: -1, day: 0 };

export function BSDatePicker({
  id,
  label,
  value,
  ariaInvalid,
  onChange,
}: BSDatePickerProps) {
  const savedDate = getBSDateParts(value);
  const [date, setDate] = useState<BsDateParts>(savedDate || emptyDate);
  const lastPublishedValue = useRef(value);

  useEffect(() => {
    if (value !== lastPublishedValue.current) {
      setDate(getBSDateParts(value) || emptyDate);
      lastPublishedValue.current = value;
    }
  }, [value]);

  const publishDate = (nextDate: BsDateParts) => {
    setDate(nextDate);
    const nextValue =
      nextDate.year && nextDate.month >= 0 && nextDate.day
        ? toADDateKey(nextDate) || ""
        : "";
    lastPublishedValue.current = nextValue;
    onChange(nextValue);
  };

  const updateYear = (yearValue: string) => {
    const year = yearValue === "none" ? 0 : Number(yearValue);
    const day =
      year && date.month >= 0 && date.day > getDaysInBSMonth(year, date.month)
        ? 0
        : date.day;
    publishDate({ ...date, year, day });
  };

  const updateMonth = (monthValue: string) => {
    const month = monthValue === "none" ? -1 : Number(monthValue);
    const day =
      month >= 0 && date.day > getDaysInBSMonth(date.year, month)
        ? 0
        : date.day;
    publishDate({ ...date, month, day });
  };

  const daysInMonth =
    date.year && date.month >= 0
      ? getDaysInBSMonth(date.year, date.month)
      : 0;

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={date.year ? String(date.year) : "none"}
          onValueChange={updateYear}
        >
          <SelectTrigger
            id={`${id}-year`}
            aria-label={`${label} year`}
            aria-invalid={ariaInvalid}
          >
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Year</SelectItem>
            {BS_YEARS.slice().reverse().map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={date.month >= 0 ? String(date.month) : "none"}
          onValueChange={updateMonth}
          disabled={!date.year}
        >
          <SelectTrigger
            id={`${id}-month`}
            aria-label={`${label} month`}
            aria-invalid={ariaInvalid}
          >
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Month</SelectItem>
            {BS_MONTH_NAMES.map((month, index) => (
              <SelectItem key={month} value={String(index)}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={date.day ? String(date.day) : "none"}
          onValueChange={(day) =>
            publishDate({ ...date, day: day === "none" ? 0 : Number(day) })
          }
          disabled={!daysInMonth}
        >
          <SelectTrigger
            id={`${id}-day`}
            aria-label={`${label} day`}
            aria-invalid={ariaInvalid}
          >
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Day</SelectItem>
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
              (day) => (
                <SelectItem key={day} value={String(day)}>
                  {day}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>
      {value && !savedDate && (
        <p className="text-xs text-amber-700">
          This saved date cannot be represented in the BS calendar. Choose a
          date to replace it.
        </p>
      )}
    </div>
  );
}
