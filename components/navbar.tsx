"use client";

import { RefreshCcw } from "lucide-react";
import { Currency } from "@/lib/types";
import { formatTimestamp } from "@/lib/format";

type NavbarProps = {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  updatedAt?: string;
  isRefreshing: boolean;
};

export function Navbar({
  currency,
  onCurrencyChange,
  updatedAt,
  isRefreshing
}: NavbarProps) {
  return (
    <header className="glass-panel soft-ring sticky top-4 z-20 rounded-3xl px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
            Live market terminal
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Gold & crypto pulse in one dashboard
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/70 p-1">
            {(["usd", "inr"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onCurrencyChange(option)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currency === option
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <RefreshCcw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin text-accent" : "text-slate-400"}`}
              />
              <span>Polling every 10 seconds</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {updatedAt ? `Updated ${formatTimestamp(updatedAt)}` : "Waiting for first tick"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
