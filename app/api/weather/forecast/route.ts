import { Hour, WeatherApiResponse } from "@/app/types/weather";
import { env } from "@/lib/env";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const queryParam = searchParams.get("queryBy");

  if (!queryParam) {
    return NextResponse.json(
      { error: "Missing queryBy param" },
      { status: 400 }
    );
  }

  const baseUrl = env.WEATHER_BASE_URL;
  const key = env.WEATHER_API_KEY;

  const url = `${baseUrl}/forecast.json?key=${key}&q=${encodeURIComponent(
    queryParam
  )}&days=1&aqi=no&alerts=no`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return NextResponse.json(
      {
        error: "WeatherAPI Error: ",
        status: response.status,
        details: text,
      },
      {
        status: response.status,
      }
    );
  }

  const data = (await response.json()) as WeatherApiResponse;

  const hourToHourForecast: Record<string, Hour[]> = {};

  for (const forecastDay of data.forecast.forecastday) {
    hourToHourForecast[forecastDay.date] = forecastDay.hour.map((hour) => ({
      time_epoch: hour.time_epoch,
      time: hour.time.slice(-5),
      temp_c: hour.temp_c,
      temp_f: hour.temp_f,
      condition: {
        text: hour.condition.text,
        icon: `https:${hour.condition.icon}`,
      },
    }));
  }

  return NextResponse.json({
    location: { name: data.location.name, region: data.location.region },
    current: {
      temp_f: Math.round(data.current.temp_f),
      temp_c: Math.round(data.current.temp_c),
      condition: {
        text: data.current.condition.text,
      },
    },
    hourToHourForecast,
  });
}
