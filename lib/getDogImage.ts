import rainCoatDog from "@/public/assets/images/maltipoo_raincoat_transparent_1024x1024.png";
import winterCoatDog from "@/public/assets/images/maltipoo_winter_transparent_1024x1024.png";
import shirtDog from "@/public/assets/images/maltipoo_shirt_transparent_1024x1024.png";
import beachDog from "@/public/assets/images/maltipoo_beach_transparent_1024x1024.png";

export function getDogImage(text: string, temp_f: number) {
  const normalized = text.toLowerCase();

  if (normalized.includes("rain")) {
    return rainCoatDog;
  }

  if (temp_f <= 68) {
    return winterCoatDog;
  }

  if (temp_f > 80) {
    return beachDog;
  }

  return shirtDog;
}
