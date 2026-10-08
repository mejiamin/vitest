# Уроки Vitest для React + Vite + TypeScript + CSS Modules | 10 Уроков
 
Курс из **10 уроков**. Каждый урок — небольшая теория, рабочий код из этого проекта и задание для самопроверки. Компоненты и стили нужны только как «подопытные»: учим мы Vitest.
 
| № | Тема | Что тестируем | Файл с тестами |
|---|------|---------------|----------------|
| 1 | Установка и настройка | конфиг, setup-файл, скрипты | `vite.config.ts`, `src/test/setup.ts` |
| **2** | **👉 Первый тест: `describe`, `it`, `expect`** | **`add`, `divide`** | **`src/utils/math.test.ts`** |
| 3 | Матчеры, `it.each`, `beforeEach` | `clamp`, `average`, `unique` | `src/utils/math.test.ts` |
| 4 | Тест компонента: `render`, `screen`, запросы | `Button` | `src/components/Button/Button.test.tsx` |
| 5 | События пользователя и `vi.fn()` | `Counter`, `Button` | `src/components/Counter/Counter.test.tsx` |
| 6 | Формы и доступные запросы | `LoginForm` | `src/components/LoginForm/LoginForm.test.tsx` |
| 7 | Асинхронность и `vi.mock` | `UserCard` | `src/components/UserCard/UserCard.test.tsx` |
| 8 | Таймеры: `vi.useFakeTimers` | `SearchBox` (debounce) | `src/components/SearchBox/SearchBox.test.tsx` |
| 9 | Хуки: `renderHook` и `act` | `useToggle` | `src/hooks/useToggle.test.ts` |
| 10 | Снапшоты, покрытие, Vitest UI, отладка | всё вместе | — |
 
---
 
## Урок 2. Первый тест: `describe`, `it`, `expect`
 
**Цель:** понять структуру теста.
 
Тестируемая функция (`src/utils/math.ts`):
 
```ts
export const add = (a: number, b: number): number => a + b
 
export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Деление на ноль')
  return a / b
}
```
 
Тест (`src/utils/math.test.ts`):
 
```ts
import { describe, expect, it } from 'vitest'
import { add, divide } from './math'
 
describe('add', () => {
  it('складывает два числа', () => {
    expect(add(2, 3)).toBe(5)
  })
})
 
describe('divide', () => {
  it('бросает ошибку при делении на ноль', () => {
    expect(() => divide(1, 0)).toThrow('Деление на ноль')
  })
})
```
 
- `describe` группирует тесты по теме.
- `it` (или `test`, это синонимы) — один сценарий. Название читается как предложение: «add складывает два числа».
- `expect(значение).матчер(ожидание)` — сама проверка.
- Файлы тестов находят по маске `*.test.ts(x)` или `*.spec.ts(x)`.
Структура теста: **подготовка → действие → проверка** (Arrange–Act–Assert). Пока она занимает одну строку, но в компонентах будет три отдельных блока.
 
**Правило:** чтобы проверить исключение, оберните вызов в функцию. Если написать `expect(divide(1, 0)).toThrow()`, исключение вылетит ещё до `expect`, и тест упадёт с ошибкой, а не с проверкой.
 
**Задание:** добавьте функцию `subtract` и два теста для неё: с положительными и отрицательными числами.

---

## Решение задания

Нужно изменить два файла: `src/utils/math.ts` и `src/utils/math.test.ts`.

### 1. Добавьте функцию в `src/utils/math.ts`

Например, сразу после `add`:

```ts
export const subtract = (a: number, b: number): number => a - b
```

### 2. Обновите импорт в `src/utils/math.test.ts`

Добавьте `subtract` в список импортируемых функций:

```ts
import { add, average, clamp, divide, subtract, unique } from './math'
```

Если забыть этот шаг, Vitest упадёт с ошибкой вида `subtract is not defined` или `subtract is not a function`.

### 3. Напишите тесты

Добавьте новый блок `describe` рядом с блоком для `add`:

```ts
describe('subtract', () => {
  it('вычитает положительные числа', () => {
    expect(subtract(5, 3)).toBe(2)
  })

  it('работает с отрицательными числами', () => {
    expect(subtract(-5, -3)).toBe(-2)
  })
})
```

Проверьте расчёт вручную: `-5 - (-3) = -5 + 3 = -2`. Минус на минус даёт плюс, поэтому результат отрицательный, но меньше по модулю, чем первое число.

Если Vitest запущен в watch-режиме (`npm test`), тесты перезапустятся при сохранении, и вы увидите, что добавилось два новых зелёных теста.

### Дополнительно (по желанию)

Хороший тест проверяет и случаи, где легко ошибиться. Например, порядок аргументов важен, в отличие от сложения:

```ts
it('не коммутативна: порядок аргументов важен', () => {
  expect(subtract(3, 5)).toBe(-2)
  expect(subtract(5, 3)).toBe(2)
})
```

И для дробей вспомните урок 3: `0.3 - 0.1` в JavaScript даёт `0.19999999999999998`, поэтому такую проверку пишут через `toBeCloseTo`:

```ts
it('для дробей используйте toBeCloseTo', () => {
  expect(subtract(0.3, 0.1)).toBeCloseTo(0.2)
})
```

---

## Навигация в watch-режиме (`npm test`)

При запуске тестов в режиме наблюдения доступны следующие горячие клавиши:

* `a` — запустить все тесты заново
* `f` — запустить только упавшие тесты
* `p` — фильтр тестов по имени файла
* `t` — фильтр по названию теста
* `h` — показать справку по всем командам
* `q` — выйти из режима наблюдения

---

## Технологии

* **Core:** React 19, TypeScript 6
* **Сборка:** Vite 8
* **Тестирование:** Vitest 5, React Testing Library, User Event, JSDOM (Vitest UI, Coverage v8)
* **Линтинг:** ESLint 10 (`typescript-eslint`, React Hooks / Refresh plugins)

---

## Запуск проекта

### Требования

* **Node.js** (v20+ / v22+)
* **npm**

### Установка зависимостей

```bash
npm install
```

### Команды и скрипты

| Команда | Описание |
| --- | --- |
| `npm run dev` | Запуск сервера разработки с автоматическим открытием в браузере |
| `npm run build` | Проверка типов TypeScript и сборка проекта для продакшена |
| `npm run preview` | Локальный просмотр собранной продакшен-версии (`dist`) |
| `npm run lint` | Проверка кода линтером ESLint |
| `npm test` | Запуск Vitest в режиме наблюдения (watch mode) |
| `npm run test:run` | Однократный запуск всех тестов (для CI/CD) |
| `npm run test:ui` | Запуск тестов с интерактивным веб-интерфейсом (Vitest UI) |
| `npm run coverage` | Генерация и вывод отчёта по покрытию кода тестами |
