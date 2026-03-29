"use client";

import { useEffect, useId } from "react";
import { CHART_TIMEFRAMES } from "@/lib/constants";
import { MarketAsset } from "@/lib/types";

type ChartComponentProps = {
  asset: MarketAsset;
  timeframe: (typeof CHART_TIMEFRAMES)[number]["value"];
};

const intervalMap = Object.fromEntries(
  CHART_TIMEFRAMES.map((item) => [item.value, item.interval])
);

export function ChartComponent({ asset, timeframe }: ChartComponentProps) {
  const containerId = useId().replace(/:/g, "");

  useEffect(() => {
    const host = document.getElementById(containerId);
    if (!host) return;

    host.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: asset.tradingViewSymbol,
      interval: intervalMap[timeframe],
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#0b1322",
      gridColor: "rgba(148, 163, 184, 0.08)",
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      withdateranges: true,
      allow_symbol_change: false,
      details: true,
      hotlist: false,
      calendar: false,
      support_host: "https://www.tradingview.com"
    });

    host.appendChild(script);

    return () => {
      host.innerHTML = "";
    };
  }, [asset.tradingViewSymbol, containerId, timeframe]);

  return (
    <div className="h-[420px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1322]">
      <div id={containerId} className="h-full w-full" />
    </div>
  );
}
