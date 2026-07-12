import { describe, expect, it } from "vitest";
import { getDogOutfitDescription } from "./getDogImage";
import { isWeatherQueryValid, toWeatherResponse } from "./weather";

describe("isWeatherQueryValid", () => {
  it.each(["10001", "02139", "40.7128,-74.006", "-33.8688,151.2093"])(
    "accepts %s",
    (query) => expect(isWeatherQueryValid(query)).toBe(true)
  );

  it.each(["", "1000", "Boston", "91,0", "0,181", "1,2,3"])(
    "rejects %s",
    (query) => expect(isWeatherQueryValid(query)).toBe(false)
  );
});

describe("toWeatherResponse", () => {
  it("returns the app's compact response and rounds temperatures", () => {
    const response = toWeatherResponse({
      location: { name: "New York", region: "New York" },
      current: {
        temp_f: 72.6,
        temp_c: 22.6,
        condition: { text: "Partly cloudy", icon: "//cdn.weatherapi.com/current.png" },
      },
      forecast: {
        forecastday: [
          {
            date: "2026-07-12",
            hour: [
              {
                time_epoch: 1_783_888_000,
                time: "2026-07-12 09:00",
                temp_f: 71.5,
                temp_c: 21.9,
                condition: { text: "Sunny", icon: "//cdn.weatherapi.com/hour.png" },
              },
            ],
          },
        ],
      },
    });

    expect(response).toEqual({
      location: { name: "New York", region: "New York" },
      current: { temp_f: 73, temp_c: 23, condition: { text: "Partly cloudy", icon: "" } },
      hourToHourForecast: {
        "2026-07-12": [
          {
            time_epoch: 1_783_888_000,
            time: "09:00",
            temp_f: 72,
            temp_c: 22,
            condition: { text: "Sunny", icon: "https://cdn.weatherapi.com/hour.png" },
          },
        ],
      },
    });
  });
});

describe("getDogOutfitDescription", () => {
  it("describes rainy, cold, hot, and mild outfits", () => {
    expect(getDogOutfitDescription("Light drizzle", 75)).toContain("raincoat");
    expect(getDogOutfitDescription("Clear", 68)).toContain("winter coat");
    expect(getDogOutfitDescription("Sunny", 81)).toContain("beach");
    expect(getDogOutfitDescription("Cloudy", 75)).toContain("shirt");
  });
});
