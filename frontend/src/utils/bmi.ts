export function calculateBMI(
  weight: number,
  heightCm: number
): number | null {
  if (
    !Number.isFinite(weight) ||
    !Number.isFinite(heightCm) ||
    weight <= 0 ||
    heightCm <= 0
  ) {
    return null
  }

  const heightMeters = heightCm / 100
  const bmi = weight / (heightMeters * heightMeters)

  return Number(bmi.toFixed(2))
}