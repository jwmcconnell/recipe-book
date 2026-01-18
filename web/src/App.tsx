import { RecipeForm } from "@/components/RecipeForm"
import { Recipe } from "@/domain/Recipe"

export function App() {
  function handleSubmit(recipe: Recipe) {
    console.log("Recipe submitted:", recipe)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <RecipeForm onSubmit={handleSubmit} />
    </div>
  )
}

export default App