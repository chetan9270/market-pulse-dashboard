"use client";

import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, BellPlus, Star } from "lucide-react";
import { MarketAsset } from "@/lib/types";
import { formatCompactNumber, formatCurrency, formatPercent } from "@/lib/format";

type PriceCardProps = {
  asset: MarketAsset;
  currency: "usd" | "inr";
  selected: boolean;
  isWatched: boolean;
  onSelect: (assetId: MarketAsset["id"]) => void;
  onToggleWatchlist: (assetId: MarketAsset["id"]) => void;
  onQuickAlert: (asset: MarketAsset) => void;
};

export function PriceCard({
  asset,
  currency,
  selected,
  isWatched,
  onSelect,
  onToggleWatchlist,
  onQuickAlert
}: PriceCardProps) {
  const positive = asset.change24h >= 0;

  return (
    <article
      className={`group cursor-pointer rounded-3xl border p-5 transition ${
        selected
          ? "border-accent/70 bg-cyan-400/10 shadow-glow"
          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"
      }`}
      onClick={() => onSelect(asset.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {asset.image ? (
            <Image
              src={asset.image}
              alt={asset.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-gold">
              {asset.symbol}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs uppercase tracking-[0.24em] text-slate-400">
                {asset.symbol}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {asset.type === "commodity"
                ? "Spot gold"
                : asset.rank
                  ? `Rank #${asset.rank}`
                  : "Crypto asset"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onQuickAlert(asset);
            }}
            className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-accent/50 hover:text-accent"
            aria-label={`Add price alert for ${asset.name}`}
          >
            <BellPlus className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleWatchlist(asset.id);
            }}
            className={`rounded-full border p-2 transition ${
              isWatched
                ? "border-gold/40 bg-gold/15 text-gold"
                : "border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
            }`}
            aria-label={`Toggle watchlist for ${asset.name}`}
          >
            <Star className={`h-4 w-4 ${isWatched ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-semibold text-white">
            {formatCurrency(asset.price, currency)}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            24h move {asset.changeValue24h ? formatCurrency(asset.changeValue24h, currency) : "N/A"}
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${
            positive
              ? "bg-emerald-500/12 text-emerald-300"
              : "bg-rose-500/12 text-rose-300"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {formatPercent(asset.change24h)}
        </div>
      </div>

      {asset.marketCap ? (
        <div className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-400">
          Market cap {formatCompactNumber(asset.marketCap)}
        </div>
      ) : null}
    </article>
  );
}
