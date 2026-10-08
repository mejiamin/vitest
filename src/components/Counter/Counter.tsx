import { useState } from 'react'
import { Button } from '../Button/Button'
import styles from './Counter.module.css'

interface CounterProps {
  initial?: number
  min?: number
  max?: number
}

export function Counter({ initial = 0, min = 0, max = 10 }: CounterProps) {
  const [count, setCount] = useState(initial)

  return (
    <section className={styles.counter} aria-label="Счётчик">
      <output className={styles.value} aria-label="Текущее значение">
        {count}
      </output>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => setCount((c) => c - 1)} disabled={count <= min}>
          Уменьшить
        </Button>
        <Button onClick={() => setCount((c) => c + 1)} disabled={count >= max}>
          Увеличить
        </Button>
        <Button variant="danger" onClick={() => setCount(initial)}>
          Сбросить
        </Button>
      </div>

      {count >= max && <p className={styles.note}>Достигнут максимум</p>}
    </section>
  )
}
