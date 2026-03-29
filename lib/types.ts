export type Currency = "usd" | "inr";
export type AssetType = "crypto" | "commodity";
export type AssetId =
  | "gold"
  | "bitcoin"
  | "ethereum"
  | "solana"
  | "ripple"
  | "dogecoin"
  | "cardano";

export type MarketAsset = {
  id: AssetId;
  name: string;
  symbol: string;
  type: AssetType;
  price: number;
  change24h: number;
  changeValue24h?: number;
  image?: string;
  rank?: number;
  marketCap?: number;
  tradingViewSymbol: string;
};

export type MarketPayload = {
  assets: MarketAsset[];
  currency: Currency;
  exchangeRateUsdToInr: number;
  mode: "polling";
  updatedAt: string;
  sources: {
    crypto: string;
    gold: string;
    fx: string;
  };
};

export type AlertRule = {
  id: string;
  assetId: AssetId;
  direction: "above" | "below";
  target: number;
  currency: Currency;
  enabled: boolean;
};
