export function generateVibrantColor(index: number): string {
  const hue = (index * 137.508) % 360; // Use golden angle approximation for distribution
  return `hsl(${hue}, 70%, 60%)`; // Vibrant, saturated colors
}

