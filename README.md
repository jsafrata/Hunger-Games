# Hunger Games

A 4-player food bidding survival game. Built with Next.js + TypeScript + Tailwind. Deploys to Vercel as a static site with zero configuration.

## How the game works

- 4 players, 4 food types (Grain, Meat, Fruit, Fish), 10 rounds.
- Each player starts with **$100 cash** and **10 of each food**.
- Each player is randomly assigned **one food type to produce** (1 unit per round).
- Each round, every player secretly bids on **one food type**.
- For each food, the **highest external bid** (above the producer's optional self-bid / reserve) wins 1 unit from the producer and pays them.
- Every player **consumes 1 of every food** each round.
- If any food stock drops below 1 at end of round, that player **dies**.
- Last one standing wins. If multiple survive 10 rounds, highest `cash + total food` wins.

## Play style

This is a **hotseat** game: all 4 players share one device and take turns entering private bids. There's a "pass the device" screen between each bid so the bids stay secret.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel, click **Add New → Project** and import the repo.
3. Vercel auto-detects Next.js. Click **Deploy**. Done.

No env vars, no database, no extra config.

## Project layout

```
app/
  layout.tsx       root layout
  page.tsx         game state machine
  globals.css      tailwind entry
components/
  Setup.tsx        name entry + rules
  RoundIntro.tsx   per-round dashboard
  BidHandoff.tsx   "pass the device" screen
  BidInput.tsx     private bid form
  Reveal.tsx       round results
  GameOver.tsx     final standings
  PlayerCard.tsx   reusable player card
lib/
  types.ts         shared types
  gameLogic.ts     pure game rules (production, auction, consumption, deaths)
```

All game logic lives in [lib/gameLogic.ts](lib/gameLogic.ts) as pure functions, so it's easy to extend (e.g. swap hotseat for a real-time backend later).
