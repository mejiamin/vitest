import { useEffect, useState } from 'react'
import { fetchUser, type User } from '@/api'
import styles from './UserCard.module.css'

interface UserCardProps {
  userId: number
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; user: User }

export function UserCard({ userId }: UserCardProps) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let ignore = false

    fetchUser(userId)
      .then((user) => {
        if (!ignore) setState({ status: 'success', user })
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Неизвестная ошибка',
          })
        }
      })

    return () => {
      ignore = true
    }
  }, [userId])

  if (state.status === 'loading') return <p className={styles.status}>Загрузка…</p>
  if (state.status === 'error') {
    return (
      <p className={styles.error} role="alert">
        {state.message}
      </p>
    )
  }

  return (
    <article className={styles.card}>
      <h3 className={styles.name}>{state.user.name}</h3>
      <p className={styles.role}>{state.user.role}</p>
    </article>
  )
}
