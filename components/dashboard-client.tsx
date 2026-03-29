"use client";

import { useEffect, useRef, useState } from "react";
import { BarChart3, Search, ShieldCheck, Star } from "lucide-react";
import { AlertsPanel } from "@/components/alerts-panel";
import { ChartComponent } from "@/components/chart-component";
import { Navbar } from "@/components/navbar";
import { PriceCard } from "@/components/price-card";
import { useLiveMarket } from "@/hooks/use-live-market";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { CHART_TIMEFRAMES, DEFAULT_CURRENCY } from "@/lib/constants";
import { formatCurrency, formatPercent } from "@/lib/format";
import { AlertRule, AssetId, Currency, MarketAsset } from "@/lib/types";

const defaultAlertDraft = {
  assetId: "gold" as AssetId,
  direction: "above" as AlertRule["direction"],
  target: ""
};

export function DashboardClient() {
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const { data, error, loading, isRefreshing } = useLiveMarket(currency);
  const assets = data?.assets ?? [];
  const [query, setQuery] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState<AssetId>("gold");
  const [watchlist, setWatchlist] = useLocalStorage<AssetId[]>(
    "market-pulse-watchlist",
    []
  );
  const [alerts, setAlerts] = useLocalStorage<AlertRule[]>(
    "market-pulse-alerts",
    []
  );
  const [triggeredMessages, setTriggeredMessages] = useState<string[]>([]);
  const [alertDraft, setAlertDraft] = useState(defaultAlertDraft);
  const [timeframe, setTimeframe] =
    useState<(typeof CHART_TIMEFRAMES)[number]["value"]>("1D");
  const firedAlertIds = useRef<Set<string>>(new Set());

  const selectedAsset =
    assets.find((asset) => asset.id === selectedAssetId) ?? assets[0] ?? null;
  const goldAsset = assets.find((asset) => asset.id === "gold");
  const filteredCryptoAssets = assets.filter((asset) => {
    if (asset.type !== "crypto") return false;

    const haystack = `${asset.name} ${asset.symbol}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  const watchlistAssets = assets.filter((asset) => watchlist.includes(asset.id));
  const displayedAssets: MarketAsset[] = goldAsset
    ? [goldAsset, ...filteredCryptoAssets]
    : filteredCryptoAssets;

  useEffect(() => {
    if (!assets.length) return;

    const selectedStillExists = assets.some((asset) => asset.id === selectedAssetId);
    if (!selectedStillExists) {
      setSelectedAssetId(assets[0].id);
    }
  }, [assets, selectedAssetId]);

  useEffect(() => {
    if (!assets.length) return;

    const assetExists = assets.some((asset) => asset.id === alertDraft.assetId);
    if (assetExists) return;

    setAlertDraft((current) => ({
      ...current,
      assetId: assets[0].id
    }));
  }, [alertDraft.assetId, assets]);

  useEffect(() => {
    if (!assets.length) return;

    const nextMessages: string[] = [];

    for (const alert of alerts) {
      if (!alert.enabled || alert.currency !== currency) continue;

      const asset = assets.find((item) => item.id === alert.assetId);
      if (!asset) continue;

      const matched =
        alert.direction === "above"
          ? asset.price >= alert.target
          : asset.price <= alert.target;

      if (!matched || firedAlertIds.current.has(alert.id)) continue;

      firedAlertIds.current.add(alert.id);
      nextMessages.push(
        `${asset.name} moved ${alert.direction} ${formatCurrency(alert.target, currency)}. Current price: ${formatCurrency(asset.price, currency)}.`
      );
    }

    if (!nextMessages.length) return;

    setTriggeredMessages((current) => [...nextMessages, ...current].slice(0, 12));

    if ("Notification" in window && Notification.permission === "granted") {
      nextMessages.forEach((message) => {
        new Notification("Market Pulse alert", { body: message });
      });
    }
  }, [alerts, assets, currency]);

  const toggleWatchlist = (assetId: AssetId) => {
    setWatchlist((current) =>
      current.includes(assetId)
        ? current.filter((id) => id !== assetId)
        : [...current, assetId]
    );
  };

  const openQuickAlert = (asset: MarketAsset) => {
    setAlertDraft({
      assetId: asset.id,
      direction: "above",
      target: asset.price.toFixed(2)
    });

    if ("Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  };

  const addAlert = () => {
    const target = Number(alertDraft.target);

    if (!Number.isFinite(target) || target <= 0) return;

    const nextAlert: AlertRule = {
      id: `${alertDraft.assetId}-${Date.now()}`,
      assetId: alertDraft.assetId,
      direction: alertDraft.direction,
      target,
      currency,
      enabled: true
    };

    setAlerts((current) => [nextAlert, ...current]);
    setAlertDraft((current) => ({ ...current, target: "" }));
    firedAlertIds.current.delete(nextAlert.id);
  };

  const toggleAlert = (alertId: string) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              enabled: !alert.enabled
            }
          : alert
      )
    );

    firedAlertIds.current.delete(alertId);
  };

  const removeAlert = (alertId: string) => {
    setAlerts((current) => current.filter((alert) => alert.id !== alertId));
    firedAlertIds.current.delete(alertId);
  };

  const dismissTriggered = (message: string) => {
    setTriggeredMessages((current) => current.filter((item) => item !== message));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
      <Navbar
        currency={currency}
        onCurrencyChange={setCurrency}
        updatedAt={data?.updatedAt}
        isRefreshing={isRefreshing}
      />

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-glow">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
              Production-ready trading dashboard
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-white">
              Track gold, Bitcoin, Ethereum, and a curated crypto watchlist in real time.
            </h2>
            <p className="mt-4 max-w-xl text-base text-slate-300">
              The app uses a polling fallback every 10 seconds, server-side API routes,
              search, local watchlists, price alerts, and a responsive dark layout tuned
              for both desktop and mobile.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
              <div className="flex items-center gap-3 text-accent">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm font-medium text-slate-200">
                  Chart-ready
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                TradingView powers the historical chart view with clean asset switching.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
              <div className="flex items-center gap-3 text-gold">
                <Star className="h-5 w-5" />
                <span className="text-sm font-medium text-slate-200">
                  Watchlist
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Favorites persist locally, so no extra database is required.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
              <div className="flex items-center gap-3 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium text-slate-200">
                  Vercel-ready
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Next.js API routes keep third-party calls server-side and deployment-friendly.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-semibold text-white">Market snapshot</h3>
          <p className="mt-1 text-sm text-slate-400">
            Focused on the assets most traders want first.
          </p>

          <div className="mt-6 space-y-4">
            {goldAsset ? (
              <div className="rounded-3xl border border-gold/20 bg-gold/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-gold/80">
                      Gold spot
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {formatCurrency(goldAsset.price, currency)}
                    </p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-2 text-sm font-medium ${
                      goldAsset.change24h >= 0
                        ? "bg-emerald-500/12 text-emerald-300"
                        : "bg-rose-500/12 text-rose-300"
                    }`}
                  >
                    {formatPercent(goldAsset.change24h)}
                  </div>
                </div>
              </div>
            ) : null}

            {assets
              .filter((asset) => asset.id === "bitcoin" || asset.id === "ethereum")
              .map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-3xl border border-white/10 bg-slate-950/55 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{asset.name}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {formatCurrency(asset.price, currency)}
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-3 py-2 text-sm font-medium ${
                        asset.change24h >= 0
                          ? "bg-emerald-500/12 text-emerald-300"
                          : "bg-rose-500/12 text-rose-300"
                      }`}
                    >
                      {formatPercent(asset.change24h)}
                    </div>
                  </div>
                </div>
              ))}

            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-400">
              Source blend: CoinGecko for crypto, Gold API for XAU, and
              ExchangeRate-API for USD/INR conversion.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {selectedAsset ? `${selectedAsset.name} chart` : "Chart"}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                TradingView handles the history layer for fast 1D, 7D, and 1M inspection.
              </p>
            </div>

            <div className="inline-flex rounded-full border border-white/10 bg-slate-950/70 p-1">
              {CHART_TIMEFRAMES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTimeframe(item.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    timeframe === item.value
                      ? "bg-white text-slate-950"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            {selectedAsset ? (
              <ChartComponent asset={selectedAsset} timeframe={timeframe} />
            ) : (
              <div className="flex h-[420px] items-center justify-center rounded-[1.75rem] border border-dashed border-white/10 text-slate-400">
                Select an asset to load the chart.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-white">Search crypto</h3>
              <p className="mt-1 text-sm text-slate-400">
                Filter by token name or symbol.
              </p>
            </div>
            <div className="status-dot bg-emerald-400 shadow-[0_0_20px_rgba(74,222,128,0.9)]" />
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search BTC, ETH, SOL..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>

          <div className="mt-5">
            <h4 className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
              Watchlist
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {watchlistAssets.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Star a card to pin it here.
                </p>
              ) : (
                watchlistAssets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedAssetId(asset.id)}
                    className="rounded-full border border-gold/20 bg-gold/10 px-3 py-2 text-sm text-gold transition hover:border-gold/40"
                  >
                    {asset.symbol}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
            <p className="font-medium text-white">Refresh mode</p>
            <p className="mt-2 text-slate-400">
              Public crypto and metals feeds rarely expose one reliable free websocket
              channel for both asset classes, so this build uses a resilient polling
              fallback that fits Vercel well.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">Market cards</h3>
          <p className="mt-1 text-sm text-slate-400">
            Gold stays pinned first, followed by searchable crypto assets.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 px-5 py-6 text-rose-100">
            {error}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {displayedAssets.map((asset) => (
              <PriceCard
                key={asset.id}
                asset={asset}
                currency={currency}
                selected={selectedAssetId === asset.id}
                isWatched={watchlist.includes(asset.id)}
                onSelect={setSelectedAssetId}
                onToggleWatchlist={toggleWatchlist}
                onQuickAlert={openQuickAlert}
              />
            ))}
          </div>
        )}
      </section>

      <AlertsPanel
        assets={assets}
        currency={currency}
        alerts={alerts}
        draft={alertDraft}
        triggeredMessages={triggeredMessages}
        onDraftChange={setAlertDraft}
        onAddAlert={addAlert}
        onToggleAlert={toggleAlert}
        onRemoveAlert={removeAlert}
        onDismissTriggered={dismissTriggered}
      />
    </main>
  );
}
