export const add = (a: number, b: number): number => a + b

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Деление на ноль')
  return a / b
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length
}

export function unique<T>(items: T[]): T[] {
  return [...new Set(items)]
}
