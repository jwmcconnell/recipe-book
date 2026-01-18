import { Recipe } from "@/domain/Recipe"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecipeCardProps {
  recipe: Recipe
  onClick: () => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <Card
      size="sm"
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{recipe.name}</CardTitle>
          <Badge variant="secondary">{recipe.type}</Badge>
        </div>
        <CardDescription>{recipe.ingredients.length} ingredients</CardDescription>
      </CardHeader>
    </Card>
  )
}
