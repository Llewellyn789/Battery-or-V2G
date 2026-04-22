# Battery Now vs Wait for V2G

A simple single-page Next.js model for comparing two Australian household DER pathways:

1. Solar + home battery + EV now
2. Solar + EV now, then V2G later

The model is intentionally lightweight and directional. It compares discounted cumulative payoff over up to 15 years, with editable assumptions for solar, battery, V2G hardware, annual benefits, discounting, and preserved capital.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy on Cloudflare Pages

Use these build settings:

```txt
Framework preset: Next.js
Build command: npm run build
Build output directory: out
Root directory: leave blank
Production branch: main
```

## Model notes

- Path A includes solar and home battery upfront cost, annual solar and battery benefits, and a future battery replacement cost.
- Path B includes solar upfront cost, preserves the home battery money on day 1, earns HISA interest on that preserved capital until V2G starts, and applies declining V2G hardware cost at the selected start year.
- Outputs are simplified estimates. Real outcomes depend on tariffs, driving behaviour, V2G availability, battery degradation, and household load shape.
