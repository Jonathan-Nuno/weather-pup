# 🐶 WeatherPup — Paw-fect Forecasts for Your Pup

Welcome to **WeatherPup**, a playful weather app that helps you check the **current conditions** and **hour-by-hour forecast for today**, all while dressing up a pup for the weather outside 🐾

Depending on what Mother Nature is up to, your pup will swap outfits — raincoat, cozy layers, or sunshine-ready gear — so you always know what kind of day it is at a glance.

---

## 🌤️ What WeatherPup Does
- **Current weather conditions** for your location or ZIP code
- **Hour-by-hour forecast for the current day**
- **Dynamic pup outfits** that change based on the weather
- Toggle between **°F / °C** to suit your preference
- Clean, mobile-friendly UI built for quick checks on the go

---

## Getting started

1. Copy `.env.example` to `.env` and add a [WeatherAPI](https://www.weatherapi.com/) key.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.

The weather key stays server-side: the browser calls WeatherPup's API route, which validates ZIP-code and browser-coordinate searches before requesting WeatherAPI.

## Quality checks

Run these before opening a pull request:

```bash
npm run lint
npm test
npm run build
```

`npm test` runs the Vitest suite covering search validation, API response shaping, temperature rounding, and pup-outfit rules. Use `npm run test:watch` while developing.

## 🦴 Under the Hood

WeatherPup is built with:
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS + shadcn/ui**
- A server-side **BFF layer** to safely fetch and shape weather data

---

## Outfit rules

- Rain, drizzle, and thunderstorms → raincoat
- 68°F and below → winter coat
- Above 80°F → beach outfit
- Everything else → shirt

All pup images have transparent backgrounds so the white Maltipoo sits naturally in the interface.

---

## 🐕 Stay Tuned!
WeatherPup is learning fast and will be fully house-trained soon.  
Check back for new features, outfit upgrades, and smoother forecasts.

---

> “Always check the weather before letting the dog out.” — *A Very Responsible Pup*
