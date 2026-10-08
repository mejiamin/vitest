export interface User {
  id: number
  name: string
  role: string
}

export async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error('Не удалось загрузить пользователя')
  return (await response.json()) as User
}
