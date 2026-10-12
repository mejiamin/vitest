# Уроки Vitest для React + Vite + TypeScript + CSS Modules | 10 Уроков
 
Курс из **10 уроков**. Каждый урок — небольшая теория, рабочий код из этого проекта и задание для самопроверки. Компоненты и стили нужны только как «подопытные»: учим мы Vitest.
 
| № | Тема | Что тестируем | Файл с тестами |
|---|------|---------------|----------------|
| 1 | Установка и настройка | конфиг, setup-файл, скрипты | `vite.config.ts`, `src/test/setup.ts` |
| 2 | Первый тест: `describe`, `it`, `expect` | `add`, `divide` | `src/utils/math.test.ts` |
| 3 |  Матчеры, `it.each`, `beforeEach` | `clamp`, `average`, `unique` | `src/utils/math.test.ts` |
| **4** | **👉 Тест компонента: `render`, `screen`, запросы** | **`Button`** | **`src/components/Button/Button.test.tsx`** |
| 5 | События пользователя и `vi.fn()` | `Counter`, `Button` | `src/components/Counter/Counter.test.tsx` |
| 6 | Формы и доступные запросы | `LoginForm` | `src/components/LoginForm/LoginForm.test.tsx` |
| 7 | Асинхронность и `vi.mock` | `UserCard` | `src/components/UserCard/UserCard.test.tsx` |
| 8 | Таймеры: `vi.useFakeTimers` | `SearchBox` (debounce) | `src/components/SearchBox/SearchBox.test.tsx` |
| 9 | Хуки: `renderHook` и `act` | `useToggle` | `src/hooks/useToggle.test.ts` |
| 10 | Снапшоты, покрытие, Vitest UI, отладка | всё вместе | — |
 
---
 
## Урок 4. Тест компонента: `render`, `screen`, запросы
 
**Цель:** отрисовать компонент и найти в нём элементы так, как их видит пользователь.
 
Компонент — `src/components/Button/Button.tsx`, стили — `Button.module.css`.
 
```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import styles from './Button.module.css'
 
describe('Button', () => {
  it('показывает переданный текст', () => {
    render(<Button>Сохранить</Button>)
    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument()
  })
 
  it('применяет класс выбранного варианта', () => {
    render(<Button variant="danger">Удалить</Button>)
    const button = screen.getByRole('button', { name: 'Удалить' })
    expect(button).toHaveClass(styles.danger)
    expect(button).not.toHaveClass(styles.primary)
  })
})
```
 
- `render` кладёт компонент в jsdom. `screen` — точка входа для поиска.
- Тестируем **поведение, видимое пользователю**, а не внутренности (состояние, имена функций).
**Три семейства запросов**
 
| Префикс | Элемента нет | Когда использовать |
|---------|--------------|--------------------|
| `getBy…` | бросает ошибку | элемент должен быть на странице сейчас |
| `queryBy…` | возвращает `null` | проверить, что элемента **нет** |
| `findBy…` | ждёт до 1000 мс, затем ошибка | элемент появится асинхронно |
 
Для нескольких элементов — `getAllBy…`, `queryAllBy…`, `findAllBy…`.
 
**Приоритет запросов** (от лучшего к худшему):
 
1. `getByRole('button', { name: '…' })` — как видят пользователь и скринридер.
2. `getByLabelText` — поля форм.
3. `getByText` — нефункциональный текст.
4. `getByTestId` — последний вариант, если ничего другого нет.
**CSS Modules в тестах.** Не пишите `toHaveClass('primary')` вручную: импортируйте объект `styles` и используйте `styles.primary`. Тогда тест не сломается, если сменится стратегия имён классов.
 
**Задание:** добавьте в тест проверку, что `variant="secondary"` даёт класс `styles.secondary`.

---

## Решение задания

Тест добавляется в `src/components/Button/Button.test.tsx`, в блок `describe('Button', ...)`, рядом с тестом для `danger`. Новые импорты не нужны: `render`, `screen`, `it`, `expect` и `styles` там уже есть.

```tsx
it('применяет класс варианта secondary', () => {
  render(<Button variant="secondary">Отмена</Button>)
  const button = screen.getByRole('button', { name: 'Отмена' })
  expect(button).toHaveClass(styles.secondary)
  expect(button).not.toHaveClass(styles.primary)
})
```

Здесь два шага:

1. `toHaveClass(styles.secondary)` проверяет, что у кнопки есть класс варианта. Значение берётся из импортированного объекта `styles`, а не из строки, поэтому тест не зависит от того, как называются классы после обработки CSS Modules.
2. `not.toHaveClass(styles.primary)` проверяет, что кнопка не осталась с классом по умолчанию. Без этой строки тест прошёл бы и в случае, когда компонент добавляет оба класса.

Если хотите проверить все три варианта одним блоком, примените `it.each` из урока 3:

```tsx
it.each(['primary', 'secondary', 'danger'] as const)(
  'применяет класс варианта %s',
  (variant) => {
    render(<Button variant={variant}>Кнопка</Button>)
    expect(screen.getByRole('button')).toHaveClass(styles[variant])
  },
)
```

`as const` нужен TypeScript: он сужает тип элементов до `'primary' | 'secondary' | 'danger'`, и `styles[variant]` проходит проверку типов.

Чтобы убедиться, что тест действительно проверяет класс, временно измените в `Button.tsx` строку с `classes`, например уберите `styles[variant]`. Тест должен упасть, и Vitest покажет, какого класса не хватает.

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
