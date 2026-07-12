import { WeatherApiUpstreamResponse } from "@/app/types/weather";
import { env } from "@/lib/env";
import { isWeatherQueryValid, toWeatherResponse } from "@/lib/weather";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const queryParam = searchParams.get("queryBy");

  const query = queryParam?.trim();
  if (!query || !isWeatherQueryValid(query)) {
    return NextResponse.json(
      { error: "Enter a valid five-digit ZIP code or use your location." },
      { status: 400 }
    );
  }

  const baseUrl = env.WEATHER_BASE_URL;
  const key = env.WEATHER_API_KEY;

  const url = `${baseUrl}/forecast.json?key=${key}&q=${encodeURIComponent(
    query
  )}&days=1&aqi=no&alerts=no`;

  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    return NextResponse.json(
      { error: "Weather service is unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  if (!response.ok) {
    const apiError = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    return NextResponse.json(
      {
        error:
          apiError?.error?.message ??
          "Weather service could not find that location. Please try another ZIP code.",
      },
      {
        status: response.status >= 500 ? 503 : response.status,
      }
    );
  }

  const data = (await response.json()) as WeatherApiUpstreamResponse;
  return NextResponse.json(toWeatherResponse(data));
}
