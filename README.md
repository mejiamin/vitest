# Уроки Vitest для React + Vite + TypeScript + CSS Modules | 10 Уроков
 
Курс из **10 уроков**. Каждый урок — небольшая теория, рабочий код из этого проекта и задание для самопроверки. Компоненты и стили нужны только как «подопытные»: учим мы Vitest.
 
| № | Тема | Что тестируем | Файл с тестами |
|---|------|---------------|----------------|
| 1 | Установка и настройка | конфиг, setup-файл, скрипты | `vite.config.ts`, `src/test/setup.ts` |
| 2 | Первый тест: `describe`, `it`, `expect` | `add`, `divide` | `src/utils/math.test.ts` |
| 3 |  Матчеры, `it.each`, `beforeEach` | `clamp`, `average`, `unique` | `src/utils/math.test.ts` |
| 4 | Тест компонента: `render`, `screen`, запросы | `Button` | `src/components/Button/Button.test.tsx` |
| **5** | **👉 События пользователя и `vi.fn()`** | **`Counter`, `Button`** | **`src/components/Counter/Counter.test.tsx`** |
| 6 | Формы и доступные запросы | `LoginForm` | `src/components/LoginForm/LoginForm.test.tsx` |
| 7 | Асинхронность и `vi.mock` | `UserCard` | `src/components/UserCard/UserCard.test.tsx` |
| 8 | Таймеры: `vi.useFakeTimers` | `SearchBox` (debounce) | `src/components/SearchBox/SearchBox.test.tsx` |
| 9 | Хуки: `renderHook` и `act` | `useToggle` | `src/hooks/useToggle.test.ts` |
| 10 | Снапшоты, покрытие, Vitest UI, отладка | всё вместе | — |
 
---
 
## Урок 5. События пользователя и `vi.fn()`
 
**Цель:** кликать по компонентам и проверять вызовы колбэков.
 
Компонент — `src/components/Counter/Counter.tsx`.
 
```tsx
import userEvent from '@testing-library/user-event'
 
it('увеличивает и уменьшает значение', async () => {
  const user = userEvent.setup()
  render(<Counter initial={5} />)
 
  await user.click(screen.getByRole('button', { name: 'Увеличить' }))
  await user.click(screen.getByRole('button', { name: 'Увеличить' }))
  expect(screen.getByLabelText('Текущее значение')).toHaveTextContent('7')
})
```
 
- `userEvent.setup()` вызывайте **до** `render`. Все действия асинхронны — всегда пишите `await`.
- `user.click`, `user.type`, `user.keyboard('{Enter}')`, `user.hover`, `user.tab` повторяют настоящие события браузера (в отличие от `fireEvent`).
- Отключённую кнопку проверяйте через `toBeDisabled()`.
**Шпионы и моки: `vi.fn()`**
 
```tsx
it('вызывает onClick при клике', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Нажми</Button>)
 
  await user.click(screen.getByRole('button', { name: 'Нажми' }))
 
  expect(onClick).toHaveBeenCalledTimes(1)
})
```
 
`vi.fn()` создаёт функцию-заглушку, которая запоминает свои вызовы:
 
| Проверка | Смысл |
|----------|-------|
| `toHaveBeenCalled()` | вызвана хотя бы раз |
| `toHaveBeenCalledTimes(n)` | вызвана ровно n раз |
| `toHaveBeenCalledWith(a, b)` | вызвана с такими аргументами |
| `not.toHaveBeenCalled()` | не вызывалась |
 
Заглушке можно задать поведение: `vi.fn().mockReturnValue(42)`, `.mockResolvedValue(data)`, `.mockRejectedValue(error)`, `.mockImplementation(fn)`.
 
**Задание:** напишите тест, что после трёх кликов по «Увеличить» и одного по «Сбросить» счётчик равен начальному значению.

---

## Решение задания

Тест добавляется в `src/components/Counter/Counter.test.tsx`, в блок `describe('Counter', ...)`. Импорты уже есть, там же определена функция `getValue`.

```tsx
it(
  'после трёх кликов «Увеличить» и «Сбросить» возвращает начальное значение',
  async () => {
    const user = userEvent.setup()
    render(<Counter initial={2} />)

    const increase = screen.getByRole('button', { name: 'Увеличить' })
    await user.click(increase)
    await user.click(increase)
    await user.click(increase)
    expect(getValue()).toHaveTextContent('5')

    await user.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(getValue()).toHaveTextContent('2')
  })
```

Что здесь происходит:

1. `initial={2}` берём не случайно: если бы начальное значение было `0`, тест мог бы пройти и при «сбросе в ноль», не проверяя, что используется именно `initial`.
2. Промежуточная проверка `toHaveTextContent('5')` подтверждает, что три клика сработали. Без неё, если клики сломаются, тест всё равно мог бы зеленеть: значение осталось бы `2`.
3. Кнопку «Увеличить» достаём один раз и кликаем по ней трижды. Это безопасно, потому что React не пересоздаёт DOM-элемент кнопки между рендерами (меняется только текст в `<output>`).
4. Каждый `user.click` нужно писать с `await`, иначе проверка выполнится раньше, чем клик обработается.

Кликов можно сделать меньше строк через цикл:

```tsx
for (let i = 0; i < 3; i++) {
  await user.click(increase)
}
```

Для трёх повторений явные три строки читаются проще, но если кликов станет десять, цикл удобнее.

Чтобы убедиться, что тест ловит ошибку, временно замените в `Counter.tsx` `setCount(initial)` на `setCount(0)`. Тест должен упасть: ожидалось `2`, получено `0`.

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
