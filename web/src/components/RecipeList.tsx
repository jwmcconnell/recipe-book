import { Recipe } from "@/domain/Recipe"
import { RecipeCard } from "./RecipeCard"

interface RecipeListProps {
  recipes: Recipe[]
  onSelect: (recipe: Recipe) => void
}

export function RecipeList({ recipes, onSelect }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">No recipes yet</p>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onSelect(recipe)}
        />
      ))}
    </div>
  )
}
