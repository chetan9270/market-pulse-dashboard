import { NextRequest, NextResponse } from "next/server";
import { getCryptoMarkets } from "@/lib/api/coingecko";
import { getUsdToInrRate } from "@/lib/api/exchange-rates";
import { getGoldSpotPrice } from "@/lib/api/gold";
import { Currency, MarketPayload } from "@/lib/types";

export const dynamic = "force-dynamic";

function normalizeCurrency(value: string | null): Currency {
  return value === "inr" ? "inr" : "usd";
}

export async function GET(request: NextRequest) {
  const currency = normalizeCurrency(
    request.nextUrl.searchParams.get("currency")
  );

  try {
    const { rate, source: fxSource } = await getUsdToInrRate();

    const [
      { assets: cryptoAssets, source: cryptoSource },
      { asset: goldAsset, source: goldSource }
    ] = await Promise.all([getCryptoMarkets(currency), getGoldSpotPrice(currency, rate)]);

    const payload: MarketPayload = {
      assets: [goldAsset, ...cryptoAssets],
      currency,
      exchangeRateUsdToInr: rate,
      mode: "polling",
      updatedAt: new Date().toISOString(),
      sources: {
        crypto: cryptoSource,
        gold: goldSource,
        fx: fxSource
      }
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Market API failed", error);

    return NextResponse.json(
      {
        message: "Unable to load live market data right now. Please retry in a few seconds."
      },
      {
        status: 500
      }
    );
  }
}
