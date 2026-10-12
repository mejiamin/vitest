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

  it('применяет класс варианта secondary', () => {
    render(<Button variant="secondary">Отмена</Button>)
    const button = screen.getByRole('button', { name: 'Отмена' })
    expect(button).toHaveClass(styles.secondary)
    expect(button).not.toHaveClass(styles.primary)
  })

  it.each(['primary', 'secondary', 'danger'] as const)(
    'применяет класс варианта %s',
    (variant) => {
      render(<Button variant={variant}>Кнопка</Button>)
      expect(screen.getByRole('button')).toHaveClass(styles[variant])
    }
  )
})
