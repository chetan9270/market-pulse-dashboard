"use client";

import { useEffect, useState } from "react";
import { REFRESH_INTERVAL_MS } from "@/lib/constants";
import { Currency, MarketPayload } from "@/lib/types";

type LiveMarketState = {
  data: MarketPayload | null;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
};

export function useLiveMarket(currency: Currency) {
  const [state, setState] = useState<LiveMarketState>({
    data: null,
    loading: true,
    error: null,
    isRefreshing: false
  });

  useEffect(() => {
    let active = true;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const loadMarket = async (backgroundRefresh = false) => {
      if (!active) return;

      setState((current) => ({
        ...current,
        loading: !current.data,
        isRefreshing: backgroundRefresh
      }));

      try {
        const response = await fetch(`/api/market?currency=${currency}`, {
          cache: "no-store"
        });

        if (!response.ok) {
          const errorPayload = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;

          throw new Error(
            errorPayload?.message ?? `Market request failed with ${response.status}`
          );
        }

        const payload = (await response.json()) as MarketPayload;

        if (!active) return;

        setState({
          data: payload,
          loading: false,
          error: null,
          isRefreshing: false
        });
      } catch (error) {
        if (!active) return;

        setState((current) => ({
          ...current,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unexpected error while loading markets.",
          isRefreshing: false
        }));
      }
    };

    void loadMarket();
    intervalId = setInterval(() => {
      void loadMarket(true);
    }, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [currency]);

  return state;
}
