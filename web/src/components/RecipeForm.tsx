import { useState } from "react"
import { Recipe } from "@/domain/Recipe"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconPlus, IconTrash } from "@tabler/icons-react"

interface Ingredient {
  name: string
  amount: number
  unit: string
}

interface RecipeFormProps {
  initialRecipe?: Recipe
  onSubmit: (recipe: Recipe) => void
  onCancel?: () => void
}

export function RecipeForm({ initialRecipe, onSubmit, onCancel }: RecipeFormProps) {
  const [name, setName] = useState(initialRecipe?.name ?? "")
  const [type, setType] = useState<"food" | "drink">(initialRecipe?.type ?? "food")
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialRecipe?.ingredients ?? [{ name: "", amount: 0, unit: "" }]
  )
  const [instructions, setInstructions] = useState<string[]>(
    initialRecipe?.instructions ?? [""]
  )

  function addIngredient() {
    setIngredients([...ingredients, { name: "", amount: 0, unit: "" }])
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string | number) {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setIngredients(updated)
  }

  function addInstruction() {
    setInstructions([...instructions, ""])
  }

  function removeInstruction(index: number) {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  function updateInstruction(index: number, value: string) {
    const updated = [...instructions]
    updated[index] = value
    setInstructions(updated)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const recipe = new Recipe({
      name,
      type,
      ingredients: ingredients.filter(i => i.name.trim() !== ""),
      instructions: instructions.filter(i => i.trim() !== ""),
    })
    onSubmit(recipe)
  }

  return (
    <Card className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialRecipe ? "Edit Recipe" : "New Recipe"}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel>Type</FieldLabel>
            <Select value={type} onValueChange={(v) => setType(v as "food" | "drink")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="drink">Drink</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ingredients</span>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                <IconPlus className="size-4" />
                Add
              </Button>
            </div>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Input
                  placeholder="Name"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={ingredient.amount || ""}
                  onChange={(e) => updateIngredient(index, "amount", parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
                <Input
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                  className="w-24"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length === 1}
                >
                  <IconTrash className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Instructions</span>
              <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                <IconPlus className="size-4" />
                Add
              </Button>
            </div>
            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-sm text-muted-foreground pt-2 w-6">{index + 1}.</span>
                <Textarea
                  placeholder={`Step ${index + 1}`}
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeInstruction(index)}
                  disabled={instructions.length === 1}
                >
                  <IconTrash className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {initialRecipe ? "Save Changes" : "Create Recipe"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
