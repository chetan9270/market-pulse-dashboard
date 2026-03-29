# Market Pulse

Market Pulse is a production-ready Next.js dashboard for live gold and cryptocurrency prices.

## Features

- Live gold, BTC, ETH, and additional crypto cards
- Polling-based real-time refresh every 10 seconds
- TradingView chart integration for historical inspection
- Search and filter for crypto assets
- Local watchlist persistence
- Basic price alerts UI
- USD / INR currency toggle
- Vercel-ready deployment setup

## Tech stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Next.js API routes for server-side data fetching
- CoinGecko API for crypto prices
- Gold API for spot gold
- ExchangeRate-API for USD/INR conversion

## Project structure

```text
app/
  api/market/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  alerts-panel.tsx
  chart-component.tsx
  dashboard-client.tsx
  navbar.tsx
  price-card.tsx
hooks/
  use-live-market.ts
  use-local-storage.ts
lib/
  api/
  constants.ts
  format.ts
  types.ts
```

## Run locally

1. Install dependencies

```bash
npm install
```

2. Create your local environment file

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Start the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Environment variables

- `NEXT_PUBLIC_DEFAULT_CURRENCY`: Initial currency shown in the UI (`usd` or `inr`)
- `NEXT_PUBLIC_MARKET_REFRESH_MS`: Client polling interval in milliseconds
- `GOLD_PRICE_API_URL`: Gold price endpoint used by the server route
- `USD_INR_API_URL`: FX endpoint used to convert gold into INR

## Deploy to Vercel

1. Push this project to GitHub.
2. Sign in to [Vercel](https://vercel.com/).
3. Click **Add New Project** and import the GitHub repository.
4. Keep the detected framework as **Next.js**.
5. Add the environment variables from `.env.example` in the Vercel dashboard.
6. Click **Deploy**.
7. After deployment, verify the homepage loads, the chart renders, and `/api/market` returns data.

## Notes

- This app uses polling rather than websockets because the chosen free public providers do not offer a dependable shared free websocket for both crypto and gold.
- Watchlist and alerts are stored in browser local storage for a zero-database deployment.
- If you later adopt a premium metals provider, extend `lib/api/gold.ts` to support API keys and richer history endpoints.

## Data sources

- CoinGecko: https://www.coingecko.com/en/api/documentation
- Gold API: https://www.gold-api.com/
- ExchangeRate-API: https://www.exchangerate-api.com/
- TradingView widgets: https://www.tradingview.com/widget/
