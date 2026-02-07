// Deterministic seeded random number generator
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate deterministic position on a sphere surface
export function getInhabitantPosition(index: number, radius: number = 2.5): [number, number, number] {
  // Use golden ratio spiral for even distribution
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
  const y = 1 - (index / 500) * 2; // Map index to y from 1 to -1
  const radiusAtY = Math.sqrt(1 - y * y);
  const theta = phi * index;
  
  const x = Math.cos(theta) * radiusAtY * radius;
  const yPos = y * radius;
  const z = Math.sin(theta) * radiusAtY * radius;
  
  return [x, yPos, z];
}

// Generate deterministic color for each inhabitant
export function getInhabitantColor(index: number): string {
  const hue = (index * 137.508) % 360; // Golden angle for color distribution
  return `hsl(${hue}, 70%, 60%)`;
}
