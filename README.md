# Уроки Vitest для React + Vite + TypeScript + CSS Modules | 10 Уроков
 
Курс из **10 уроков**. Каждый урок — небольшая теория, рабочий код из этого проекта и задание для самопроверки. Компоненты и стили нужны только как «подопытные»: учим мы Vitest.
 
| № | Тема | Что тестируем | Файл с тестами |
|---|------|---------------|----------------|
| **1** | **👉 Установка и настройка** | **конфиг, setup-файл, скрипты** | **`vite.config.ts`, `src/test/setup.ts`** |
| 2 | Первый тест: `describe`, `it`, `expect` | `add`, `divide` | `src/utils/math.test.ts` |
| 3 | Матчеры, `it.each`, `beforeEach` | `clamp`, `average`, `unique` | `src/utils/math.test.ts` |
| 4 | Тест компонента: `render`, `screen`, запросы | `Button` | `src/components/Button/Button.test.tsx` |
| 5 | События пользователя и `vi.fn()` | `Counter`, `Button` | `src/components/Counter/Counter.test.tsx` |
| 6 | Формы и доступные запросы | `LoginForm` | `src/components/LoginForm/LoginForm.test.tsx` |
| 7 | Асинхронность и `vi.mock` | `UserCard` | `src/components/UserCard/UserCard.test.tsx` |
| 8 | Таймеры: `vi.useFakeTimers` | `SearchBox` (debounce) | `src/components/SearchBox/SearchBox.test.tsx` |
| 9 | Хуки: `renderHook` и `act` | `useToggle` | `src/hooks/useToggle.test.ts` |
| 10 | Снапшоты, покрытие, Vitest UI, отладка | всё вместе | — |
 
---
 
## Урок 1. Установка и настройка (*уже готова*)
 
**Цель:** запустить Vitest в проекте с React и CSS Modules.
 
Vitest работает поверх Vite и берёт ваш `vite.config.ts`: те же плагины, те же алиасы, поэтому отдельный конфиг для тестов обычно не нужен.

```bash
npm i -D vitest jsdom @testing-library/react @testing-library/dom
```

```bash
npm i -D @testing-library/user-event @testing-library/jest-dom
```

```bash
npm i -D vitest @vitest/coverage-v8 @vitest/ui
```
 
Что за что отвечает:
 
- `vitest` — сам раннер.
- `jsdom` — имитация браузерного DOM в Node.js.
- `@testing-library/react`, `@testing-library/dom` — рендер компонентов и поиск элементов.
- `@testing-library/user-event` — реалистичные клики и ввод.
- `@testing-library/jest-dom` — матчеры вида `toBeInTheDocument()`.
- `@vitest/coverage-v8`, `@vitest/ui` — покрытие и веб-интерфейс (пригодятся в уроке 10).

**`vite.config.ts`:**
 
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: {
      include: /.+/,
      modules: { classNameStrategy: 'non-scoped' },
    },
  },
})
```
 
- Первая строка (`/// <reference ... />`) добавляет TypeScript знание о ключе `test`.
- `environment: 'jsdom'` — без него `document` и `window` не существуют.
- `setupFiles` — файл, который выполняется перед каждым тестовым файлом.
- `css.include: /.+/` — по умолчанию Vitest не обрабатывает CSS; с этой настройкой `*.module.css` разбирается так же, как в браузере.
- `classNameStrategy: 'non-scoped'` — вместо хешей вроде `_primary_1x2y3` в тестах будет `primary`. Читать упавшие тесты и снапшоты становится проще.

**`src/test/setup.ts`:**
 
```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
 
afterEach(() => {
  cleanup()
})
```
 
Первая строка подключает матчеры jest-dom к `expect` из Vitest. `cleanup` убирает отрендеренный компонент после каждого теста. Мы импортируем `describe`/`it`/`expect` явно (режим `globals` выключен), поэтому RTL не может зарегистрировать очистку автоматически.
 
**Скрипты в `package.json`:**
 
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
  }
}
```
 
- `vitest` — режим наблюдения: перезапускает только затронутые тесты при сохранении файла.
- `vitest run` — один прогон, подходит для CI.

**Задание:** выполните `npm test`. Должны пройти все тесты. Потом сломайте одну проверку (например, `toBe(5)` → `toBe(6)`) и посмотрите, как Vitest показывает разницу.

---

## Решение задания

Это делается в три шага.

**`src/utils/math.test.ts`:**
```ts
import { describe, expect, it } from 'vitest'
import { add } from './math'

describe('add', () => {
  it('складывает два числа', () => {
    expect(add(2, 3)).toBe(5)
  })
})
```

### 1. Запустите тесты

В терминале, в папке проекта:

```bash
npm test
```

Vitest запустится в режиме наблюдения (watch) и не завершится сам. В выводе рядом с каждым файлом должна стоять зелёная галочка:

```
 ✓ src/utils/math.test.ts
 ...
 Test Files  1 passed (1)
```

Если команда не запускается, проверьте, что в `package.json` есть скрипт `"test": "vitest"` и что вы установили пакеты из урока 1.

### 2. Сломайте проверку

Не останавливая Vitest, откройте `src/utils/math.test.ts` и поменяйте одну строку:

```ts
expect(add(2, 3)).toBe(5)   // было
expect(add(2, 3)).toBe(6)   // стало
```

Сохраните файл. Vitest сам перезапустит этот тест.

### 3. Прочитайте сообщение об ошибке

Вывод будет примерно таким:

```
 FAIL  src/utils/math.test.ts > add > складывает два числа
AssertionError: expected 5 to be 6 // Object.is equality

- Expected
+ Received

- 6
+ 5

 ❯ src/utils/math.test.ts:6:21
      5|   it('складывает два числа', () => {
      6|     expect(add(2, 3)).toBe(6)
       |                       ^
```

Как это читать:

- `FAIL … > add > складывает два числа` показывает путь к тесту: файл, блок `describe` и название `it`.
- `expected 5 to be 6` говорит, что ожидали 6, а функция вернула 5.
- Блок `Expected` / `Received` — это diff: `-` обозначает ожидаемое значение, `+` — фактическое. Для объектов и массивов в нём подсвечиваются только отличающиеся поля, и это особенно удобно.
- Ниже указана точная строка в файле, где упала проверка (`6:21` — строка 6, столбец 21).

### Верните всё как было

Поменяйте `6` обратно на `5` и сохраните. Тест снова позеленеет.

### Что ещё попробовать в watch-режиме

Нажмите в терминале:

- `a` — запустить все тесты заново;
- `f` — запустить только упавшие;
- `p` — отфильтровать по имени файла;
- `h` — показать все команды;
- `q` — выйти.

Для более наглядного diff сломайте проверку на массиве: в тесте `unique` замените `[3, 1, 2]` на `[3, 1, 5]`. Vitest покажет, какой именно элемент не совпал.

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
