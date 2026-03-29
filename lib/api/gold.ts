import { GOLD_ASSET } from "@/lib/constants";
import { Currency, MarketAsset } from "@/lib/types";

type GoldApiResponse = {
  name?: string;
  symbol?: string;
  price?: number;
  prev_close_price?: number;
  open_price?: number;
  ch?: number;
  chp?: number;
};

const GOLD_SOURCE =
  process.env.GOLD_PRICE_API_URL ?? "https://api.gold-api.com/price/XAU";

export async function getGoldSpotPrice(
  currency: Currency,
  usdToInrRate: number
): Promise<{ asset: MarketAsset; source: string }> {
  const response = await fetch(GOLD_SOURCE, {
    next: { revalidate: 10 }
  });

  if (!response.ok) {
    throw new Error(`Gold price request failed with ${response.status}`);
  }

  const data = (await response.json()) as GoldApiResponse;
  const basePriceUsd = data.price ?? 0;
  const previousCloseUsd =
    data.prev_close_price ?? data.open_price ?? basePriceUsd;
  const changeValueUsd =
    typeof data.ch === "number" ? data.ch : basePriceUsd - previousCloseUsd;
  const changePercent =
    typeof data.chp === "number"
      ? data.chp
      : previousCloseUsd
        ? (changeValueUsd / previousCloseUsd) * 100
        : 0;

  const convertedPrice =
    currency === "inr" ? basePriceUsd * usdToInrRate : basePriceUsd;
  const convertedChange =
    currency === "inr" ? changeValueUsd * usdToInrRate : changeValueUsd;

  return {
    asset: {
      id: GOLD_ASSET.id,
      name: GOLD_ASSET.name,
      symbol: GOLD_ASSET.symbol,
      type: GOLD_ASSET.type,
      price: convertedPrice,
      change24h: changePercent,
      changeValue24h: convertedChange,
      tradingViewSymbol: GOLD_ASSET.tradingViewSymbol
    },
    source: GOLD_SOURCE
  };
}
