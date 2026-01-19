"use client";
import { Hour, WeatherApiResponse } from "@/app/types/weather";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

type WeatherCarousel = {
  weatherData: WeatherApiResponse;
  tempMeasurement: "F" | "C";
};

export default function WeatherCarousel({
  weatherData,
  tempMeasurement,
}: WeatherCarousel) {
  const [nowSec, setNowSec] = useState<number | null>(null);
  const byHour = weatherData.hourToHourForecast;

  const slides: Array<{ date: string; hour: Hour }> = useMemo(() => {
    if (!byHour) return [];
    return Object.entries(byHour)
      .flatMap(([date, hours]) => hours.map((hour) => ({ date, hour })))
      .sort((a, b) => a.hour.time_epoch - b.hour.time_epoch);
  }, [byHour]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setNowSec(Math.floor(Date.now() / 1000));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const startIndex = useMemo(() => {
    if (!nowSec || slides.length === 0) return 0;

    const startOfThisHourSec = nowSec - (nowSec % 3600);
    const idx = slides.findIndex(
      (s) => s.hour.time_epoch >= startOfThisHourSec
    );

    return idx === -1 ? Math.max(0, slides.length - 1) : idx;
  }, [nowSec, slides]);

  if (!byHour || Object.keys(byHour).length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hourly forecast available.
      </p>
    );
  }

  return (
    <div className="w-full m-w-md max-h-30">
      <Carousel
        className="relative w-full max-w-md px-10"
        opts={{ startIndex, align: "center" }}
      >
        <CarouselContent>
          {slides.map(({ date, hour }) => (
            <CarouselItem
              key={`${date}-${hour.time_epoch}`}
              className="basis-1/3 md:basis-1/3 lg:basis-1/3"
            >
              <div className="rounded-lg border p-3 justify-items-center items-center">
                <p className="text-sm text-medium">{hour.time}</p>
                <Image
                  src={hour.condition.icon}
                  width={64}
                  height={64}
                  alt={`Weather icon for ${hour.condition.text}`}
                />
                {tempMeasurement === "F" && (
                  <p className="text-lg font-semibold">
                    {Math.round(hour.temp_f)}°F
                  </p>
                )}
                {tempMeasurement === "C" && (
                  <p className="text-lg font-semibold">
                    {Math.round(hour.temp_c)}°C
                  </p>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0.5" />
        <CarouselNext className="right-0.5" />
      </Carousel>
    </div>
  );
}
