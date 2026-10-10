import { describe, expect, it } from "vitest";
import { add, divide } from "./math";

describe('add', () => {
  it('складывает два числа', () => {
    expect(add(2, 3)).toBe(5)
  })
})

describe('devide', () => {
  it('бросает ошибку при делении на ноль', () => {
    expect(() => divide(1, 0)).toThrow('Деление на ноль')
  })
})
