const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function getRecipes(token: string) {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.status}`)
  }

  return response.json()
}

export async function getRecipe(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch recipe: ${response.status}`)
  }

  return response.json()
}

export async function deleteRecipe(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete recipe: ${response.status}`)
  }
}

export async function updateRecipe(
  token: string,
  id: string,
  data: Partial<{
    name: string
    type: string
    ingredients: unknown[]
    instructions: string[]
  }>
) {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update recipe: ${response.status}`)
  }

  return response.json()
}

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
