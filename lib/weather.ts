import type { Hour, WeatherApiResponse, WeatherApiUpstreamResponse } from "@/app/types/weather";

const ZIP_CODE_PATTERN = /^\d{5}(?:-\d{4})?$/;

export function isWeatherQueryValid(query: string): boolean {
  if (ZIP_CODE_PATTERN.test(query)) {
    return true;
  }

  const coordinates = query.split(",").map((part) => Number(part.trim()));
  if (coordinates.length !== 2 || coordinates.some((coordinate) => !Number.isFinite(coordinate))) {
    return false;
  }

  const [latitude, longitude] = coordinates;
  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
}

export function toWeatherResponse(data: WeatherApiUpstreamResponse): WeatherApiResponse {
  const hourToHourForecast: Record<string, Hour[]> = {};

  for (const forecastDay of data.forecast.forecastday) {
    hourToHourForecast[forecastDay.date] = forecastDay.hour.map((hour) => ({
      time_epoch: hour.time_epoch,
      time: hour.time.slice(-5),
      temp_c: Math.round(hour.temp_c),
      temp_f: Math.round(hour.temp_f),
      condition: {
        text: hour.condition.text,
        icon: `https:${hour.condition.icon}`,
      },
    }));
  }

  return {
    location: { name: data.location.name, region: data.location.region },
    current: {
      temp_f: Math.round(data.current.temp_f),
      temp_c: Math.round(data.current.temp_c),
      condition: { text: data.current.condition.text, icon: "" },
    },
    hourToHourForecast,
  };
}
