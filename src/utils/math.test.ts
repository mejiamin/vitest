import { beforeEach, describe, expect, it } from "vitest";
import { add, average, clamp, divide, unique } from "./math";

describe('add', () => {
  it('складывает два числа', () => {
    expect(add(2, 3)).toBe(5)
  })
  it('для дробей используйте toBeCloseTo', () => {
    expect(add(0.1, 0.2)).not.toBe(0.3)
    expect(add(0.1, 0.2)).toBeCloseTo(0.3)
  })
})

describe('devide', () => {
  it('бросает ошибку при делении на ноль', () => {
    expect(() => divide(1, 0)).toThrow('Деление на ноль')
  })
})

describe('clamp', () => {
  it.each([
    { value: 5, min: 0, max: 10, expected: 5 },
    { value: -3, min: 0, max: 10, expected: 0 },
    { value: 42, min: 0, max: 10, expected: 10 },
  ])('clamp($value, $min, $max) возращает $expected', ({ value, min, max, expected }) => {
    expect(clamp(value, min, max)).toBe(expected)
  })
})

describe('average', () => {
  let numbers: number[]

  beforeEach(() => {
    numbers = [2, 4, 6]
  })

  it('считает среднее', () => {
    expect(average(numbers)).toBe(4)
  })
})

describe('divide', () => {
  it('делит числа', () => {
    expect(divide(10, 4)).toBe(2.5)
  })

  // it.each([
  //   { a: 10, b: 2, expected: 5 },
  //   { a: 9, b: 3, expected: 3 },
  //   { a: -8, b: 2, expected: -4 },
  // ])('divide($a, $b) возвращает $expected', ({ a, b, expected }) => {
  //   expect(divide(a, b)).toBe(expected)
  // })

  it.each([
    [10, 2, 5],
    [9, 3, 3],
    [-8, 2, -4],
  ])('divide(%i, %i) возращает %d', (a, b, expected) => {
    expect(divide(a, b)).toBe(expected)
  })

  it('бросает ошибку при делении на ноль', () => {
    expect(() => divide(1, 0)).toThrow('Деление на ноль')
  })
})

describe('unique', () => {
  it('работает со строками', () => {
    expect(unique(['a', 'a', 'b'])).toEqual(['a', 'b'])
  })
})
