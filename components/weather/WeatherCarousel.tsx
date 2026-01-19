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

type WeatherCarousel = {
  weatherData: WeatherApiResponse;
};

export default function WeatherCarousel({ weatherData }: WeatherCarousel) {
  const byHour = weatherData.hourToHourForecast;

  if (!byHour || Object.keys(byHour).length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hourly forecast available.
      </p>
    );
  }

  const slides: Array<{ date: string; hour: Hour }> = Object.entries(byHour)
    .flatMap(([date, hours]) => hours.map((hour) => ({ date, hour })))
    .sort((a, b) => a.hour.time_epoch - b.hour.time_epoch);

  return (
    <div className="w-full m-w-md">
      <Carousel className="relative w-full max-w-md px-10">
        <CarouselContent>
          {slides.map(({ date, hour }) => (
            <CarouselItem
              key={`${date}-${hour.time_epoch}`}
              className="basis-1/3 md:basis-1/3 lg:basis-1/3"
            >
              <div className="rounded-lg border p-3 justify-items-center items-center">
                <p className="text-xs text-muted-foreground">{hour.time}</p>
                <Image
                  src={hour.condition.icon}
                  width={64}
                  height={64}
                  alt={`Weather icon for ${hour.condition.text}`}
                />
                <p className="text-lg font-semibold">
                  {Math.round(hour.temp_f)}°F
                </p>
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
