import { Currency } from "@/lib/types";

const symbolMap: Record<Currency, string> = {
  usd: "USD",
  inr: "INR"
};

export function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: symbolMap[currency],
    maximumFractionDigits: value > 999 ? 2 : 4
  }).format(value);
}

export function formatCompactNumber(value?: number) {
  if (value === undefined) return "N/A";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
