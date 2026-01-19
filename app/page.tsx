"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import WeatherCard from "@/components/weather/WeatherCard";
import { useTheme } from "next-themes";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun } from "@hugeicons/core-free-icons";

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [tempMeasurement, setTempMeasurement] = useState<"F" | "C">("F");

  return (
    <div className="min-h-dvh flex justify-center items-center">
      <Card className="max-w-87.5 w-full shadow-md/30">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-base leading-none">
            WeatherPup 🐶🐾
          </CardTitle>

          <CardAction className="flex items-center gap-10">
            {theme === "dark" ? (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme("light")}
                aria-label="Switch to light mode"
              >
                <HugeiconsIcon icon={Sun} size={20} />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme("dark")}
                aria-label="Switch to dark mode"
              >
                <HugeiconsIcon icon={Moon02Icon} size={20} />
              </Button>
            )}
            <div className="flex flex-row">
              <p className="text-sm leading-none">°F</p>
              <Switch
                className="
                data-checked:bg-primary 
                data-unchecked:bg-primary 
                dark:data-checked:bg-primary 
                dark:data-unchecked:bg-primary 
              dark:[&>span]:bg-white
                align-middle"
                onCheckedChange={(checked) =>
                  setTempMeasurement(checked ? "C" : "F")
                }
              />
              <p className="text-sm leading-none">°C</p>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardDescription className="text-base text-medium">
            Get paw-fect weather recommendations for your area!
          </CardDescription>
          <WeatherCard tempMeasurement={tempMeasurement} />
        </CardContent>
      </Card>
    </div>
  );
}
