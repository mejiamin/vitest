import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../Button/Button'
import styles from './LoginForm.module.css'

export interface LoginData {
  email: string
  password: string
}

interface LoginFormProps {
  onSubmit: (data: LoginData) => void
}

type Errors = Partial<Record<keyof LoginData, string>>

function validate({ email, password }: LoginData): Errors {
  const errors: Errors = {}
  if (!email.trim()) errors.email = 'Введите email'
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Некорректный email'
  if (password.length < 8) errors.password = 'Минимум 8 символов'
  return errors
}

const inputClass = (invalid: boolean) =>
  invalid ? `${styles.input} ${styles.invalid}` : styles.input

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const emailId = useId()
  const passwordId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate({ email, password })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSubmit({ email, password })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Вход">
      <div className={styles.field}>
        <label className={styles.label} htmlFor={emailId}>
          Email
        </label>
        <input
          id={emailId}
          type="email"
          className={inputClass(Boolean(errors.email))}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
        />
        {errors.email && (
          <p id={`${emailId}-error`} className={styles.error} role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={passwordId}>
          Пароль
        </label>
        <input
          id={passwordId}
          type="password"
          className={inputClass(Boolean(errors.password))}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? `${passwordId}-error` : undefined}
        />
        {errors.password && (
          <p id={`${passwordId}-error`} className={styles.error} role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <Button type="submit">Войти</Button>
    </form>
  )
}
