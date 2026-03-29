import { CRYPTO_ASSETS } from "@/lib/constants";
import { Currency, MarketAsset } from "@/lib/types";

const COINGECKO_SOURCE = "https://api.coingecko.com/api/v3";

type CoinGeckoMarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
};

export async function getCryptoMarkets(currency: Currency): Promise<{
  assets: MarketAsset[];
  source: string;
}> {
  const ids = CRYPTO_ASSETS.map((asset) => asset.coingeckoId).join(",");
  const url = `${COINGECKO_SOURCE}/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;

  const response = await fetch(url, {
    headers: {
      accept: "application/json"
    },
    next: { revalidate: 10 }
  });

  if (!response.ok) {
    throw new Error(`CoinGecko markets request failed with ${response.status}`);
  }

  const data = (await response.json()) as CoinGeckoMarketCoin[];

  const assets = data
    .map((coin) => {
      const assetConfig = CRYPTO_ASSETS.find(
        (asset) => asset.coingeckoId === coin.id
      );

      if (!assetConfig) {
        return null;
      }

      return {
        id: assetConfig.id,
        name: assetConfig.name,
        symbol: coin.symbol.toUpperCase(),
        type: "crypto",
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h ?? 0,
        changeValue24h: coin.price_change_24h ?? 0,
        image: coin.image,
        rank: coin.market_cap_rank,
        marketCap: coin.market_cap,
        tradingViewSymbol: assetConfig.tradingViewSymbol
      } satisfies MarketAsset;
    })
    .filter(Boolean) as MarketAsset[];

  return {
    assets,
    source: url
  };
}
