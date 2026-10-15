# Quarter

Quarter is a two-sided prototype for the drinks industry:

- **Consumer app:** a membership card for partner bars, with tiered rewards, visit history and QR table ordering (start or join a shared table, order, pay, pick up).
- **Brand dashboard (`/quarter`):** shows the on-trade insight a brand could buy from that behavioural data. It covers brand share at price parity by city, head-to-head competitor share, share at three price levels, trade-up by member tenure, and single-city drill-downs.

The idea is that FMCG drinks brands measure consumer preference with retail scanner data (Nielsen, Circana) and surveys. Neither captures the moment of choice in a bar. A loyalty app that logs what people actually order could, and anonymised, aggregated insight sold to brands is the revenue model.

**Live demo:** https://nightlightappeurope.vercel.app

## Status

This is a demo prototype, with no backend.

- All dashboard data is **simulated** (`src/data/quarterSummary.json`: 25,000 synthetic members across Paris, Milan, Barcelona, Vienna and Lisbon).
- Member state is stored in `localStorage`. Opening any app page provisions a demo member.
- ID verification, Face ID, payments and Apple Wallet are simulated UI flows.
- The venue list and map show 5 partner bars in Paris.

## Stack

React 19, Vite 8, React Router 7, Tailwind CSS 4, Chart.js, Leaflet. Deployed on Vercel.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build
```
