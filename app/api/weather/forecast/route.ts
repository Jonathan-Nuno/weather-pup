import { env } from "@/lib/env";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const queryParam = searchParams.get("queryBy");

  if (!queryParam) {
    return NextResponse.json(
      { erro: "Missing queryBy param" },
      { status: 400 }
    );
  }

  const baseUrl = env.WEATHER_BASE_URL;
  const key = env.WEATHER_API_KEY;

  const url = `${baseUrl}/forecast.json?key=${key}&q=${encodeURIComponent(
    queryParam
  )}&days=3&aqi=no&alerts=no`;

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

  const data = await response.json();

  return NextResponse.json({
    location: { name: data.location.name, region: data.location.region },
    current: {
      temp_f: Math.round(data.current.temp_f),
      condition: {
        text: data.current.condition.text,
      },
    },
  });
}
