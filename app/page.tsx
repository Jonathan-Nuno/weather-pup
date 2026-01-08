"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import maltipooRaincoatTransparent from "../public/assets/images/maltipoo_raincoat_transparent_1024x1024.png";

type WeatherForecast = {
  location: { name: string; region: string };
  current: {
    temp_f: number;
    condition: { text: string };
  };
};

export default function Page() {
  const [zipcode, setZipcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/weather/forecast?queryBy=${encodeURIComponent(zipcode)}`
      );
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const json = (await response.json()) as WeatherForecast;
      setWeather(json);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>WeatherPup 🐶🐾</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardDescription>
            Get paw-fect weather recommendations for your area!
          </CardDescription>
          <form className="flex flex-col gap-2">
            <Input
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              placeholder="Enter Zip ( e.g., 12345"
            />
            <Button
              onClick={onSubmit}
              disabled={loading || zipcode.trim().length < 5}
            >
              {loading ? "Fetching..." : "Fetch Weather"}
            </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
