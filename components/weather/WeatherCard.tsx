"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import maltipooRaincoatTransparent from "@/public/assets/images/maltipoo_raincoat_transparent_1024x1024.png";
import maltipooTransparent from "@/public/assets/images/maltipoo_transparent_1024x1024.png";
import maltipooFetchingTransparent from "@/public/assets/images/maltipoo_fetching_transparent_1024x1024.png";
import maltipooErrorTransparent from "@/public/assets/images/maltipoo_error_transparent_1024x1024.png";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getBrowserLocation } from "@/lib/geolocation";
import WeatherCarousel from "./WeatherCarousel";
import { WeatherApiResponse } from "@/app/types/weather";

type ViewState = "idle" | "loading" | "loaded" | "error";

export default function WeatherCard() {
  const [zipcode, setZipcode] = useState("");
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState>("idle");

  async function fetchForecast(queryBy: string) {
    const response = await fetch(
      `/api/weather/forecast?queryBy=${encodeURIComponent(queryBy)}`
    );
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || `Request failed: ${response.status}`);
    }
    const json = (await response.json()) as WeatherApiResponse;
    setWeather(json);
  }

  async function onZipSubmit(e: React.FormEvent) {
    e.preventDefault();
    setViewState("loading");
    setError(null);

    try {
      await fetchForecast(zipcode.trim());
      setViewState("loaded");
    } catch (e: unknown) {
      setViewState("error");
      setError(getErrorMessage(e));
    }
  }

  async function onUseMyLocation() {
    setViewState("loading");
    setError(null);

    try {
      const { lat, lon } = await getBrowserLocation();
      await fetchForecast(`${lat},${lon}`);
      setViewState("loaded");
    } catch (e: unknown) {
      setViewState("error");
      setError(getErrorMessage(e));
    }
  }

  return (
    <>
      {viewState === "idle" && (
        <div className="flex flex-col justify-center items-center gap-1 min-h-100">
          <Image
            src={maltipooTransparent}
            width={240}
            height={240}
            alt="Picture of an idle dog"
            className="max-w-full"
          />
          <div>
            <p className="max-w-87.5 h-5"></p>
            <p className="max-w-87.5 h-5"></p>
          </div>
        </div>
      )}

      {viewState === "loading" && (
        <div className="flex flex-col justify-center items-center gap-1 min-h-100">
          <Image
            src={maltipooFetchingTransparent}
            width={240}
            height={240}
            alt="Picture of dog fetching ball"
          />
          <div>
            <p className="max-w-87.5 h-5">Fetching Weather!</p>
            <p className="max-w-87.5 h-5"></p>
          </div>
        </div>
      )}

      {viewState === "loaded" && weather && (
        <div className="flex flex-col justify-center items-center gap-1 min-h-100">
          <Image
            src={maltipooRaincoatTransparent}
            width={240}
            height={240}
            alt="Picture of dog in a raincoat"
          />
          <div className="text-sm">
            <p className="font-medium">
              {weather.location.name}, {weather.location.region}
            </p>
            <p>
              {weather.current.temp_f}°F • {weather.current.condition.text}
            </p>
          </div>
          <WeatherCarousel weatherData={weather} />
        </div>
      )}

      {viewState === "error" && (
        <div className="flex flex-col justify-center items-center gap-1 min-h-100">
          <Image
            src={maltipooErrorTransparent}
            width={240}
            height={240}
            alt="Picture of dog with knocked over trash can"
          />
          <div>
            <p className="text-sm text-destructive max-w-87.5 h-5">{error}</p>
            <p className="max-w-87.5 h-5"></p>
          </div>
        </div>
      )}

      <form className="flex flex-col gap-2" onSubmit={onZipSubmit}>
        <Input
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="Enter ZIP (e.g., 12345)"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={viewState === "loading" || zipcode.trim().length < 5}
          >
            {viewState === "loading" ? "Fetching..." : "Fetch Weather"}
          </Button>

          <Button
            type="button"
            variant={"secondary"}
            onClick={onUseMyLocation}
            disabled={viewState === "loading"}
          >
            Use my location
          </Button>
        </div>
      </form>
    </>
  );
}
