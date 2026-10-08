import { useState } from 'react'
import { Button, Counter, LoginForm, type LoginData, SearchBox, UserCard } from './components'
import './styles/tokens.css'
import styles from './App.module.css'

export default function App() {
  const [lastSearch, setLastSearch] = useState('—')
  const [lastLogin, setLastLogin] = useState<LoginData | null>(null)

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Лаборатория Vitest</h1>

      <section className={styles.panel}>
        <h2 className={styles.heading}>Button</h2>
        <div className={styles.row}>
          <Button>Сохранить</Button>
          <Button variant="secondary">Отмена</Button>
          <Button variant="danger">Удалить</Button>
          <Button loading>Сохранить</Button>
          <Button disabled>Недоступно</Button>
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.heading}>Counter</h2>
        <Counter />
      </section>

      <section className={styles.panel}>
        <h2 className={styles.heading}>LoginForm</h2>
        <LoginForm onSubmit={setLastLogin} />
        {lastLogin && <p className={styles.result}>Отправлено: {lastLogin.email}</p>}
      </section>

      <section className={styles.panel}>
        <h2 className={styles.heading}>SearchBox</h2>
        <SearchBox onSearch={setLastSearch} />
        <p className={styles.result}>Последний запрос: {lastSearch}</p>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.heading}>UserCard</h2>
        {/* В dev-режиме API нет, поэтому увидите состояние ошибки — его тоже тестируем */}
        <UserCard userId={1} />
      </section>
    </main>
  )
}
