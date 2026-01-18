"use client";
import { Hour, WeatherApiResponse } from "@/app/types/weather";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    <>
      <Carousel className="w-full max-w-md">
        <CarouselContent>
          {slides.map(({ date, hour }) => (
            <CarouselItem
              key={`${date}-${hour.time_epoch}`}
              className="md:basis-1/2 lg:basis-1/2"
            >
              <div className="rounded-lg border p-3 text-center">
                <p className="text-xs text-muted-foreground">{hour.time}</p>
                <p className="text-lg font-semibold">
                  {Math.round(hour.temp_f)}°F
                </p>
                <p className="text-xs">{hour.condition.text}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
