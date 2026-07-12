"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useState } from "react";
import maltipooTransparent from "@/public/assets/images/maltipoo_transparent_1024x1024.png";
import maltipooFetchingTransparent from "@/public/assets/images/maltipoo_fetching_transparent_1024x1024.png";
import maltipooErrorTransparent from "@/public/assets/images/maltipoo_error_transparent_1024x1024.png";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getBrowserLocation } from "@/lib/geolocation";
import WeatherCarousel from "./WeatherCarousel";
import { WeatherApiResponse } from "@/app/types/weather";
import { getDogImage, getDogOutfitDescription } from "@/lib/getDogImage";

type ViewState = "idle" | "loading" | "loaded" | "error";
type WeatherCardProps = {
  tempMeasurement: "F" | "C";
};

export default function WeatherCard({ tempMeasurement }: WeatherCardProps) {
  const [zipcode, setZipcode] = useState("");
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState>("idle");
  const requestController = useRef<AbortController | null>(null);

  async function fetchForecast(queryBy: string) {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    const response = await fetch(
      `/api/weather/forecast?queryBy=${encodeURIComponent(queryBy)}`,
      { signal: controller.signal }
    );
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new Error(body?.error || `Request failed: ${response.status}`);
    }
    const json = (await response.json()) as WeatherApiResponse;
    setWeather(json);
  }

  async function onZipSubmit(e: React.FormEvent) {
    e.preventDefault();
    setViewState("loading");
    setError(null);

    if (!/^\d{5}(?:-\d{4})?$/.test(zipcode.trim())) {
      setViewState("error");
      setError("Enter a valid five-digit ZIP code.");
      return;
    }

    try {
      await fetchForecast(zipcode.trim());
      setViewState("loaded");
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") return;
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
      if (e instanceof DOMException && e.name === "AbortError") return;
      setViewState("error");
      setError(getErrorMessage(e));
    }
  }

  const dogSource = weather
    ? getDogImage(weather.current.condition.text, weather.current.temp_f)
    : maltipooTransparent;
  const dogAlt = weather
    ? getDogOutfitDescription(weather.current.condition.text, weather.current.temp_f)
    : "White Maltipoo";

  return (
    <>
      {viewState === "idle" && (
        <div className="flex flex-col justify-center items-center gap-1 max-h-100">
          <Image
            src={maltipooTransparent}
            width={200}
            height={200}
            alt="White Maltipoo waiting for a weather search"
            className="max-w-full"
          />
          <div>
            <p className="max-w-87.5 h-5"></p>
            <p className="max-w-87.5 h-5"></p>
          </div>
          <div className="min-h-30 text-center">
            <p className="text-base">
              Enter your ZIP code or use your location to see the weather and
              update your pup’s fit!
            </p>
          </div>
        </div>
      )}

      {viewState === "loading" && (
        <div className="flex flex-col justify-center items-center gap-1 max-h-100">
          <Image
            src={maltipooFetchingTransparent}
            width={200}
            height={200}
            alt="White Maltipoo fetching the weather forecast"
          />
          <div>
            <p className="max-w-87.5 h-5 text-base">Fetching Weather!</p>
            <p className="max-w-87.5 h-5"></p>
          </div>
          <div className="min-h-30"></div>
        </div>
      )}

      {viewState === "loaded" && weather && (
        <div className="flex flex-col justify-center items-center gap-1 max-h-100">
          <Image
            src={dogSource}
            width={200}
            height={200}
            alt={dogAlt}
          />
          <div className="text-base">
            <p className="font-medium" aria-live="polite">
              {weather.location.name}
              {weather.location.region ? `, ${weather.location.region}` : ""}
            </p>
            {tempMeasurement === "F" && (
              <p>
                {weather.current.temp_f}°F • {weather.current.condition.text}
              </p>
            )}
            {tempMeasurement === "C" && (
              <p>
                {weather.current.temp_c}°C • {weather.current.condition.text}
              </p>
            )}
          </div>
          <WeatherCarousel
            weatherData={weather}
            tempMeasurement={tempMeasurement}
          />
        </div>
      )}

      {viewState === "error" && (
        <div className="flex flex-col justify-center items-center gap-1 max-h-100">
          <Image
            src={maltipooErrorTransparent}
            width={200}
            height={200}
            alt="White Maltipoo after a weather lookup problem"
          />
          <div>
            <p className="text-sm text-destructive max-w-87.5" role="alert">
              {error}
            </p>
            <p className="max-w-87.5 h-5"></p>
          </div>
          <div className="min-h-30"></div>
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
          aria-label="ZIP code"
          aria-describedby="zip-help"
        />
        <p id="zip-help" className="sr-only">
          Enter a five-digit United States ZIP code.
        </p>
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
