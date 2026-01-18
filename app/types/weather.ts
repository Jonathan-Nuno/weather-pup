interface Condition {
  text: string;
}
export interface Hour {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  condition: Condition;
}

export interface ForecastDay {
  date: string;
  hour: Hour[];
}

export interface WeatherApiResponse {
  location: { name: string; region: string };
  current: { temp_f: number; condition: Condition };
  forecast: { forecastday: ForecastDay[] };
  hourToHourForecast?: Record<string, Hour[]>;
}
