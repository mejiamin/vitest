# Уроки Vitest для React + Vite + TypeScript + CSS Modules | 10 Уроков
 
Курс из **10 уроков**. Каждый урок — небольшая теория, рабочий код из этого проекта и задание для самопроверки. Компоненты и стили нужны только как «подопытные»: учим мы Vitest.
 
| № | Тема | Что тестируем | Файл с тестами |
|---|------|---------------|----------------|
| 1 | Установка и настройка | конфиг, setup-файл, скрипты | `vite.config.ts`, `src/test/setup.ts` |
| 2 | Первый тест: `describe`, `it`, `expect` | `add`, `divide` | `src/utils/math.test.ts` |
| **3** | **👉 Матчеры, `it.each`, `beforeEach`** | **`clamp`, `average`, `unique`** | **`src/utils/math.test.ts`** |
| 4 | Тест компонента: `render`, `screen`, запросы | `Button` | `src/components/Button/Button.test.tsx` |
| 5 | События пользователя и `vi.fn()` | `Counter`, `Button` | `src/components/Counter/Counter.test.tsx` |
| 6 | Формы и доступные запросы | `LoginForm` | `src/components/LoginForm/LoginForm.test.tsx` |
| 7 | Асинхронность и `vi.mock` | `UserCard` | `src/components/UserCard/UserCard.test.tsx` |
| 8 | Таймеры: `vi.useFakeTimers` | `SearchBox` (debounce) | `src/components/SearchBox/SearchBox.test.tsx` |
| 9 | Хуки: `renderHook` и `act` | `useToggle` | `src/hooks/useToggle.test.ts` |
| 10 | Снапшоты, покрытие, Vitest UI, отладка | всё вместе | — |
 
---
 
## Урок 3. Матчеры, `it.each`, `beforeEach`
 
**Цель:** выбирать правильный матчер и не копировать тесты.
 
| Матчер | Когда |
|--------|-------|
| `toBe(x)` | примитивы, сравнение по ссылке (`Object.is`) |
| `toEqual(x)` | объекты и массивы по содержимому |
| `toStrictEqual(x)` | то же, но учитывает `undefined`-поля и классы |
| `toBeCloseTo(x)` | дробные числа |
| `toContain(x)` | элемент в массиве или подстрока |
| `toHaveLength(n)` | длина массива или строки |
| `toThrow(msg)` | функция бросает ошибку |
| `toBeTruthy()` / `toBeNull()` / `toBeUndefined()` | проверка «истинности» |
| `.not` | отрицание любого матчера |
 
```ts
it('для дробей используйте toBeCloseTo', () => {
  expect(add(0.1, 0.2)).not.toBe(0.3) // 0.30000000000000004
  expect(add(0.1, 0.2)).toBeCloseTo(0.3)
})
```
 
**Параметризованные тесты** — один тест, много наборов данных:
 
```ts
it.each([
  { value: 5, min: 0, max: 10, expected: 5 },
  { value: -3, min: 0, max: 10, expected: 0 },
  { value: 42, min: 0, max: 10, expected: 10 },
])('clamp($value, $min, $max) возвращает $expected', ({ value, min, max, expected }) => {
  expect(clamp(value, min, max)).toBe(expected)
})
```
 
`$value`, `$min` и другие подставляются в название теста из полей объекта.
 
**Хуки жизненного цикла**
 
```ts
describe('average', () => {
  let numbers: number[]
 
  beforeEach(() => {
    numbers = [2, 4, 6] // свежие данные перед каждым тестом
  })
 
  it('считает среднее', () => {
    expect(average(numbers)).toBe(4)
  })
})
```
 
- `beforeEach` / `afterEach` — до и после каждого теста в блоке.
- `beforeAll` / `afterAll` — один раз на блок.
**Полезные пометки**
 
- `it.skip(...)` — пропустить.
- `it.only(...)` — запустить только этот тест (не забудьте убрать перед коммитом).
- `it.todo('описание')` — напоминание о тесте, который ещё не написан.
**Задание:** добавьте `it.each` для `divide` с тремя наборами и проверьте, что `unique(['a', 'a', 'b'])` возвращает `['a', 'b']`.

---

## Решение задания

Оба теста добавляются в `src/utils/math.test.ts`. Новые импорты не нужны: `it`, `expect`, `divide` и `unique` там уже есть.

### 1. `it.each` для `divide`

Добавьте его внутрь существующего блока `describe('divide', ...)`:

```ts
describe('divide', () => {
  it('делит числа', () => {
    expect(divide(10, 4)).toBe(2.5)
  })

  it.each([
    { a: 10, b: 2, expected: 5 },
    { a: 9, b: 3, expected: 3 },
    { a: -8, b: 2, expected: -4 },
  ])('divide($a, $b) возвращает $expected', ({ a, b, expected }) => {
    expect(divide(a, b)).toBe(expected)
  })

  it('бросает ошибку при делении на ноль', () => {
    expect(() => divide(1, 0)).toThrow('Деление на ноль')
  })
})
```

Vitest создаст три отдельных теста с названиями `divide(10, 2) возвращает 5`, `divide(9, 3) возвращает 3` и `divide(-8, 2) возвращает -4`. Если один набор упадёт, в отчёте будет видно, какой именно.

Выбирайте наборы с точным результатом: `toBe` не подойдёт для чисел вроде `1 / 3`. Для них используйте `toBeCloseTo`.

Тот же `it.each` можно записать компактнее, массивами. Тогда в названии вместо `$поле` используются `%i` (целое число) и `%d` (число):

```ts
it.each([
  [10, 2, 5],
  [9, 3, 3],
  [-8, 2, -4],
])('divide(%i, %i) возвращает %d', (a, b, expected) => {
  expect(divide(a, b)).toBe(expected)
})
```

Вариант с объектами понятнее, когда параметров больше двух, потому что у каждого значения есть имя.

### 2. `unique` со строками

Добавьте в блок `describe('unique', ...)`:

```ts
it('работает со строками', () => {
  expect(unique(['a', 'a', 'b'])).toEqual(['a', 'b'])
})
```

Функция `unique<T>` обобщённая, поэтому TypeScript сам выведет `T = string`, и менять код функции не нужно. Для сравнения массивов используем `toEqual`, а не `toBe`: `toBe` сравнивает ссылки, а два разных массива с одинаковым содержимым не равны по ссылке.

После сохранения в watch-режиме у вас должно прибавиться четыре теста: три из `it.each` и один для строк.

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
