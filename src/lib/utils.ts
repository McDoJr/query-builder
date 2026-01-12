import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function toISODateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function valueToString(value: any) {
  if (typeof value === "string") return value;
  return String(value);
}

export function collectTextFormat(values: string[]): string {
  if (values.length === 0) return "Select Value...";

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} or ${values[1]}`;
  }

  if (values.length === 3) {
    return `${values[0]}, ${values[1]} or ${values[2]}`;
  }

  // > 3
  return `${values[0]}, ${values[1]} or ${values.slice(2).length} more`;
}

export function sortFieldValues(values: string[], selected: string[]) {
  values.sort((a, b) => {
    const aSelected = selected.includes(a);
    const bSelected = selected.includes(b);

    return Number(bSelected) - Number(aSelected);
  });
}
