import { Recipe } from "@/domain/Recipe"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { IconArrowLeft, IconPencil, IconTrash } from "@tabler/icons-react"

interface RecipeDetailProps {
  recipe: Recipe
  onEdit: () => void
  onDelete: () => void
  onBack: () => void
}

export function RecipeDetail({ recipe, onEdit, onDelete, onBack }: RecipeDetailProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon-sm" onClick={onBack}>
            <IconArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{recipe.name}</CardTitle>
          <Badge variant="secondary">{recipe.type}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <section>
          <h2 className="font-medium mb-2">Ingredients</h2>
          <ul className="space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-sm">
                {ingredient.name} - {ingredient.amount} {ingredient.unit}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-medium mb-2">Instructions</h2>
          <ol className="space-y-2">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="text-sm">
                {index + 1}. {instruction}
              </li>
            ))}
          </ol>
        </section>
      </CardContent>

      <CardFooter className="gap-2 justify-end">
        <Button variant="outline" onClick={onEdit}>
          <IconPencil className="size-4" />
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <IconTrash className="size-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
