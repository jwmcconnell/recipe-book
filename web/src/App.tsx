import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react'
import { RecipeForm } from '@/components/RecipeForm'
import { Recipe } from '@/domain/Recipe'

export function App() {
  function handleSubmit(recipe: Recipe) {
    console.log('Recipe submitted:', recipe)
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
