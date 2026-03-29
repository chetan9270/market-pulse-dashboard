const FX_SOURCE =
  process.env.USD_INR_API_URL ?? "https://open.er-api.com/v6/latest/USD";

export async function getUsdToInrRate() {
  try {
    const response = await fetch(FX_SOURCE, {
      next: { revalidate: 60 * 60 }
    });

    if (!response.ok) {
      throw new Error(`FX lookup failed with ${response.status}`);
    }

    const data = await response.json();
    const inrRate = data?.rates?.INR;

    if (typeof inrRate !== "number") {
      throw new Error("INR rate missing from FX payload");
    }

    return {
      rate: inrRate,
      source: FX_SOURCE
    };
  } catch (error) {
    console.error("FX provider fallback engaged", error);
    return {
      rate: 83,
      source: `${FX_SOURCE} (fallback)`
    };
  }
}
