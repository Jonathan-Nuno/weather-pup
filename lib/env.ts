import { z } from "zod";

const envSchema = z.object({
  WEATHER_BASE_URL: z.httpUrl(),
  WEATHER_API_KEY: z.string().min(1, "Weather API key required"),
});

const envUpdate = envSchema.safeParse(process.env);

if (!envUpdate.success) {
  console.error("Invalid environment variables: ", envUpdate.error);
  throw new Error("Invalid environment variables");
}

export const env = envUpdate.data;
