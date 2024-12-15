import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stopAnimation() {
  const element = document.getElementById("loading-animation");
  
  if (element) {
    element.remove();
    console.log("Animation stopped successfully");
  } else {
    console.error("Failed to stop animation");
  }
}