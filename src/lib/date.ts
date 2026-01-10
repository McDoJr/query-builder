import { DateRangeUnit } from "@/types/types";
import { DateRange } from "react-day-picker";

export function getInferedDefaultValue(
  withHeader: boolean,
  defaultRangeValue: DateRange | undefined,
  unit: DateRangeUnit,
  operator: string,
) {
  if (!withHeader || !defaultRangeValue) return "";
  const inferred = inferValueFromRange(defaultRangeValue, unit, operator);

  return inferred && Number.isInteger(inferred) ? String(inferred - 1) : "";
}

export function inferValueFromRange(
  range: DateRange,
  rangeType: DateRangeUnit,
  operator: string,
): number | null {
  if (!range.from || !range.to) return null;

  const from = startOfDay(range.from);
  const to = endOfDay(range.to);

  if (operator === "last") {
    if (rangeType === "months") {
      return Math.abs(diffInMonths(from, to));
    }

    if (rangeType === "weeks") {
      return Math.abs(diffInDays(from, to)) / 7;
    }

    return Math.abs(diffInDays(from, to));
  }

  if (operator === "next") {
    if (rangeType === "months") {
      return diffInMonths(from, to);
    }

    if (rangeType === "weeks") {
      return diffInDays(from, to) / 7;
    }

    return diffInDays(from, to);
  }

  return null;
}

export function calculateDateRange(
  operator: string,
  value: number,
  rangeType: DateRangeUnit,
  baseDate: Date = new Date(),
): DateRange {
  const start = new Date(baseDate);
  const end = new Date(baseDate);

  const amount = rangeType === "weeks" ? value * 7 : value;

  if (operator === "last") {
    if (rangeType === "months") {
      start.setMonth(start.getMonth() - value);
    } else {
      start.setDate(start.getDate() - amount);
    }

    return {
      from: startOfDay(start),
      to: endOfDay(end),
    };
  }

  // operator === "next"
  if (rangeType === "months") {
    end.setMonth(end.getMonth() + value);
  } else {
    end.setDate(end.getDate() + amount);
  }

  return {
    from: startOfDay(start),
    to: endOfDay(end),
  };
}

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function isAfter(a: Date, b: Date) {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function diffInDays(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function diffInMonths(from: Date, to: Date) {
  return (
    to.getFullYear() * 12 +
    to.getMonth() -
    (from.getFullYear() * 12 + from.getMonth())
  );
}
