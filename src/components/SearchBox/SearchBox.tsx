import { useEffect, useId, useState } from 'react'
import styles from './SearchBox.module.css'

interface SearchBoxProps {
  onSearch: (query: string) => void
  delay?: number
}

export function SearchBox({ onSearch, delay = 300 }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const id = useId()

  // debounce: вызываем onSearch только после паузы в наборе
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = query.trim()
      if (trimmed !== '') onSearch(trimmed)
    }, delay)

    return () => clearTimeout(timer)
  }, [query, delay, onSearch])

  return (
    <div className={styles.search}>
      <label className={styles.label} htmlFor={id}>
        Поиск
      </label>
      <input
        id={id}
        type="search"
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
