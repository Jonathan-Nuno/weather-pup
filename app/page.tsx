"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WeatherCard from "@/components/weather/WeatherCard";

export default function Page() {
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
          <WeatherCard />
        </CardContent>
      </Card>
    </div>
  );
}
