import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from '@clerk/clerk-react'
import { RecipeForm } from '@/components/RecipeForm'
import { Recipe } from '@/domain/Recipe'
import { createRecipe } from '@/lib/api'

export function App() {
  const { getToken } = useAuth()

  async function handleSubmit(recipe: Recipe) {
    const token = await getToken()
    if (!token) {
      console.error('No auth token available')
      return
    }

    try {
      const result = await createRecipe(token, {
        name: recipe.name,
        type: recipe.type,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      })
      console.log('Recipe created:', result)
    } catch (error) {
      console.error('Failed to create recipe:', error)
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
        <SignedIn>
          <RecipeForm onSubmit={handleSubmit} />
        </SignedIn>
        <SignedOut>
          <p className="text-center text-muted-foreground">
            Sign in to create recipes
          </p>
        </SignedOut>
      </main>
    </div>
  )
}

export default App
