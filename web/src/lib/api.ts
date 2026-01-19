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

export async function getGroceryLists(token: string) {
  const response = await fetch(`${API_BASE_URL}/grocery-lists`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch grocery lists: ${response.status}`)
  }

  return response.json()
}

export async function getGroceryList(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/grocery-lists/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch grocery list: ${response.status}`)
  }

  return response.json()
}

export async function createGroceryList(token: string, data: { name: string }) {
  const response = await fetch(`${API_BASE_URL}/grocery-lists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create grocery list: ${response.status}`)
  }

  return response.json()
}

export async function updateGroceryList(
  token: string,
  id: string,
  data: { name: string }
) {
  const response = await fetch(`${API_BASE_URL}/grocery-lists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update grocery list: ${response.status}`)
  }

  return response.json()
}

export async function deleteGroceryList(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/grocery-lists/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete grocery list: ${response.status}`)
  }
}

export async function addGroceryItem(
  token: string,
  listId: string,
  data: { name: string; quantity?: string }
) {
  const response = await fetch(`${API_BASE_URL}/grocery-lists/${listId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to add grocery item: ${response.status}`)
  }

  return response.json()
}

export async function updateGroceryItem(
  token: string,
  listId: string,
  itemId: string,
  data: { name?: string; quantity?: string; checked?: boolean }
) {
  const response = await fetch(
    `${API_BASE_URL}/grocery-lists/${listId}/items/${itemId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to update grocery item: ${response.status}`)
  }

  return response.json()
}

export async function deleteGroceryItem(
  token: string,
  listId: string,
  itemId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/grocery-lists/${listId}/items/${itemId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to delete grocery item: ${response.status}`)
  }
}
