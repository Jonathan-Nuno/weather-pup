"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import maltipooRaincoatTransparent from "@/public/assets/images/maltipoo_raincoat_transparent_1024x1024.png";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getBrowserLocation } from "@/lib/geolocation";

type WeatherForecast = {
  location: { name: string; region: string };
  current: {
    temp_f: number;
    condition: { text: string };
  };
};

export default function WeatherCard() {
  const [zipcode, setZipcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchForecast(queryBy: string) {
    const response = await fetch(
      `/api/weather/forecast?queryBy=${encodeURIComponent(queryBy)}`
    );
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || `Request failed: ${response.status}`);
    }
    const json = (await response.json()) as WeatherForecast;
    setWeather(json);
  }

  async function onZipSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fetchForecast(zipcode.trim());
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function onUseMyLocation() {
    setLoading(true);
    setError(null);

    try {
      const { lat, lon } = await getBrowserLocation();
      await fetchForecast(`${lat},${lon}`);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="flex flex-col gap-2" onSubmit={onZipSubmit}>
        <Input
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="Enter Zip ( e.g., 12345)"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={loading || zipcode.trim().length < 5}>
            {loading ? "Fetching..." : "Fetch Weather!"}
          </Button>

          <Button
            type="button"
            variant={"secondary"}
            onClick={onUseMyLocation}
            disabled={loading}
          >
            Use my location
          </Button>
        </div>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {weather && (
        <div className="flex flex-col justify-center items-center">
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
        </div>
      )}
    </>
  );
}
