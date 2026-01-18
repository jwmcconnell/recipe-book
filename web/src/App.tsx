import { useState, useEffect } from 'react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from '@clerk/clerk-react'
import { RecipeForm } from '@/components/RecipeForm'
import { RecipeList } from '@/components/RecipeList'
import { RecipeDetail } from '@/components/RecipeDetail'
import { Recipe } from '@/domain/Recipe'
import { Button } from '@/components/ui/button'
import { IconPlus } from '@tabler/icons-react'
import {
  createRecipe,
  getRecipes,
  updateRecipe,
  deleteRecipe,
} from '@/lib/api'

type View = 'list' | 'detail' | 'create' | 'edit'

interface ApiRecipe {
  id: string
  name: string
  type: 'food' | 'drink'
  ingredients: { name: string; amount: number; unit: string }[]
  instructions: string[]
}

function toRecipe(apiRecipe: ApiRecipe): Recipe {
  return new Recipe({
    id: apiRecipe.id,
    name: apiRecipe.name,
    type: apiRecipe.type,
    ingredients: apiRecipe.ingredients,
    instructions: apiRecipe.instructions,
  })
}

export function App() {
  const { getToken } = useAuth()
  const [view, setView] = useState<View>('list')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecipes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadRecipes() {
    const token = await getToken()
    if (!token) return

    try {
      setLoading(true)
      const data = await getRecipes(token)
      setRecipes(data.map(toRecipe))
    } catch (error) {
      console.error('Failed to load recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(recipe: Recipe) {
    const token = await getToken()
    if (!token) return

    try {
      await createRecipe(token, {
        name: recipe.name,
        type: recipe.type,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      })
      await loadRecipes()
      setView('list')
    } catch (error) {
      console.error('Failed to create recipe:', error)
    }
  }

  async function handleUpdate(recipe: Recipe) {
    const token = await getToken()
    if (!token || !selectedRecipe?.id) return

    try {
      await updateRecipe(token, selectedRecipe.id, {
        name: recipe.name,
        type: recipe.type,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      })
      await loadRecipes()
      setView('list')
      setSelectedRecipe(null)
    } catch (error) {
      console.error('Failed to update recipe:', error)
    }
  }

  async function handleDelete() {
    const token = await getToken()
    if (!token || !selectedRecipe?.id) return

    try {
      await deleteRecipe(token, selectedRecipe.id)
      await loadRecipes()
      setView('list')
      setSelectedRecipe(null)
    } catch (error) {
      console.error('Failed to delete recipe:', error)
    }
  }

  function handleSelectRecipe(recipe: Recipe) {
    setSelectedRecipe(recipe)
    setView('detail')
  }

  function renderContent() {
    if (loading && view === 'list') {
      return <p className="text-center text-muted-foreground">Loading...</p>
    }

    switch (view) {
      case 'list':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">My Recipes</h1>
              <Button onClick={() => setView('create')}>
                <IconPlus className="size-4" />
                New Recipe
              </Button>
            </div>
            <RecipeList recipes={recipes} onSelect={handleSelectRecipe} />
          </div>
        )

      case 'detail':
        if (!selectedRecipe) return null
        return (
          <RecipeDetail
            recipe={selectedRecipe}
            onEdit={() => setView('edit')}
            onDelete={handleDelete}
            onBack={() => {
              setView('list')
              setSelectedRecipe(null)
            }}
          />
        )

      case 'create':
        return (
          <RecipeForm
            onSubmit={handleCreate}
            onCancel={() => setView('list')}
          />
        )

      case 'edit':
        if (!selectedRecipe) return null
        return (
          <RecipeForm
            initialRecipe={selectedRecipe}
            onSubmit={handleUpdate}
            onCancel={() => setView('detail')}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex justify-end p-4 border-b">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main className="p-8">
        <SignedIn>{renderContent()}</SignedIn>
        <SignedOut>
          <p className="text-center text-muted-foreground">
            Sign in to manage your recipes
          </p>
        </SignedOut>
      </main>
    </div>
  )
}

export default App
