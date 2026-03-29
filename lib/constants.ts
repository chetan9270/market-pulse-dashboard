import { AssetId, AssetType, Currency } from "@/lib/types";

const configuredDefaultCurrency = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY;
const configuredRefreshMs = process.env.NEXT_PUBLIC_MARKET_REFRESH_MS;
const normalizedRefreshMs = Number(configuredRefreshMs);

export const DEFAULT_CURRENCY: Currency =
  configuredDefaultCurrency?.toLowerCase() === "inr" ? "inr" : "usd";
export const REFRESH_INTERVAL_MS =
  Number.isFinite(normalizedRefreshMs) && normalizedRefreshMs >= 5_000
    ? normalizedRefreshMs
    : 10_000;

export const CRYPTO_ASSETS: Array<{
  id: AssetId;
  coingeckoId: string;
  name: string;
  symbol: string;
  type: AssetType;
  tradingViewSymbol: string;
}> = [
  {
    id: "bitcoin",
    coingeckoId: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    type: "crypto",
    tradingViewSymbol: "BINANCE:BTCUSDT"
  },
  {
    id: "ethereum",
    coingeckoId: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    type: "crypto",
    tradingViewSymbol: "BINANCE:ETHUSDT"
  },
  {
    id: "solana",
    coingeckoId: "solana",
    name: "Solana",
    symbol: "SOL",
    type: "crypto",
    tradingViewSymbol: "BINANCE:SOLUSDT"
  },
  {
    id: "ripple",
    coingeckoId: "ripple",
    name: "XRP",
    symbol: "XRP",
    type: "crypto",
    tradingViewSymbol: "BINANCE:XRPUSDT"
  },
  {
    id: "dogecoin",
    coingeckoId: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    type: "crypto",
    tradingViewSymbol: "BINANCE:DOGEUSDT"
  },
  {
    id: "cardano",
    coingeckoId: "cardano",
    name: "Cardano",
    symbol: "ADA",
    type: "crypto",
    tradingViewSymbol: "BINANCE:ADAUSDT"
  }
];

export const GOLD_ASSET = {
  id: "gold" as AssetId,
  symbol: "XAU",
  name: "Gold",
  type: "commodity" as AssetType,
  tradingViewSymbol: "OANDA:XAUUSD"
};

export const CHART_TIMEFRAMES = [
  { label: "1D", value: "1D", interval: "15" },
  { label: "7D", value: "7D", interval: "60" },
  { label: "1M", value: "1M", interval: "D" }
] as const;
