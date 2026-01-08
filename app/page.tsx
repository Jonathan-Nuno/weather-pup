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
import { useState } from "react";

export default function Page() {
  const [zipcode, setZipcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<unknown>(null);
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
      const json = await response.json();
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
        <CardContent>
          <CardDescription>
            Get paw-fect weather recommendations for your area!
          </CardDescription>
          <div className="">
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
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {weather && (
            <div className="text-sm">
              <p className="font-medium">
                {weather.location.name}, {weather.location.region}
              </p>
              <p>
                {Math.round(weather.current.temp_f)}°F •{" "}
                {weather.current.condition.text}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
