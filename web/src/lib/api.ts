const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function createRecipe(
  token: string,
  data: {
    name: string
    type: string
    ingredients: unknown[]
    instructions: string[]
  }
) {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create recipe: ${response.status}`)
  }

  return response.json()
}
