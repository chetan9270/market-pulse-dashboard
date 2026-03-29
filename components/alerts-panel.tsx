"use client";

import { BellRing, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { AlertRule, MarketAsset } from "@/lib/types";

type AlertsPanelProps = {
  assets: MarketAsset[];
  currency: "usd" | "inr";
  alerts: AlertRule[];
  draft: {
    assetId: MarketAsset["id"];
    direction: AlertRule["direction"];
    target: string;
  };
  triggeredMessages: string[];
  onDraftChange: (draft: {
    assetId: MarketAsset["id"];
    direction: AlertRule["direction"];
    target: string;
  }) => void;
  onAddAlert: () => void;
  onToggleAlert: (alertId: string) => void;
  onRemoveAlert: (alertId: string) => void;
  onDismissTriggered: (message: string) => void;
};

export function AlertsPanel({
  assets,
  currency,
  alerts,
  draft,
  triggeredMessages,
  onDraftChange,
  onAddAlert,
  onToggleAlert,
  onRemoveAlert,
  onDismissTriggered
}: AlertsPanelProps) {
  const currentCurrencyAlerts = alerts.filter(
    (alert) => alert.currency === currency
  );

  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-accent/10 p-3 text-accent">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Price alerts</h3>
            <p className="text-sm text-slate-400">
              Set a simple threshold and let the dashboard watch for it.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_0.8fr_0.8fr_auto]">
          <select
            value={draft.assetId}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                assetId: event.target.value as MarketAsset["id"]
              })
            }
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-accent/60"
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.symbol})
              </option>
            ))}
          </select>

          <select
            value={draft.direction}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                direction: event.target.value as AlertRule["direction"]
              })
            }
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-accent/60"
          >
            <option value="above">Crosses above</option>
            <option value="below">Drops below</option>
          </select>

          <input
            type="number"
            min="0"
            step="0.01"
            value={draft.target}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                target: event.target.value
              })
            }
            placeholder={`Target in ${currency.toUpperCase()}`}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-accent/60"
          />

          <button
            type="button"
            onClick={onAddAlert}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Add alert
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {currentCurrencyAlerts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
              No {currency.toUpperCase()} alerts yet. Add one above to start monitoring.
            </div>
          ) : (
            currentCurrencyAlerts.map((alert) => {
              const asset = assets.find((item) => item.id === alert.assetId);
              if (!asset) return null;

              return (
                <div
                  key={alert.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-white">
                      {asset.name} {alert.direction === "above" ? "above" : "below"}{" "}
                      {formatCurrency(alert.target, currency)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Live price {formatCurrency(asset.price, currency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleAlert(alert.id)}
                      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                        alert.enabled
                          ? "bg-emerald-500/12 text-emerald-300"
                          : "bg-white/8 text-slate-300"
                      }`}
                    >
                      {alert.enabled ? "Enabled" : "Paused"}
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveAlert(alert.id)}
                      className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-rose-400/50 hover:text-rose-300"
                      aria-label="Delete alert"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-lg font-semibold text-white">Triggered this session</h3>
        <p className="mt-1 text-sm text-slate-400">
          Notifications stay in-app for a clean Vercel deployment.
        </p>

        <div className="mt-5 space-y-3">
          {triggeredMessages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
              No alerts have fired yet.
            </div>
          ) : (
            triggeredMessages.map((message) => (
              <button
                key={message}
                type="button"
                onClick={() => onDismissTriggered(message)}
                className="w-full rounded-2xl border border-accent/30 bg-accent/10 px-4 py-4 text-left text-sm text-cyan-50 transition hover:border-accent/60"
              >
                {message}
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
