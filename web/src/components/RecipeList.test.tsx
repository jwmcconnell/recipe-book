import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RecipeList } from "./RecipeList"
import { Recipe } from "@/domain/Recipe"

describe("RecipeList", () => {
  const recipes = [
    new Recipe({
      id: "1",
      name: "Pasta",
      type: "food",
      ingredients: [{ name: "Noodles", amount: 500, unit: "g" }],
      instructions: ["Boil water"],
    }),
    new Recipe({
      id: "2",
      name: "Smoothie",
      type: "drink",
      ingredients: [{ name: "Banana", amount: 1, unit: "piece" }],
      instructions: ["Blend"],
    }),
  ]

  it("renders a card for each recipe", () => {
    render(<RecipeList recipes={recipes} onSelect={() => {}} />)

    expect(screen.getByText("Pasta")).toBeInTheDocument()
    expect(screen.getByText("Smoothie")).toBeInTheDocument()
  })

  it("calls onSelect with recipe when card is clicked", async () => {
    const handleSelect = vi.fn()
    render(<RecipeList recipes={recipes} onSelect={handleSelect} />)

    await userEvent.click(screen.getByText("Pasta"))

    expect(handleSelect).toHaveBeenCalledWith(recipes[0])
  })
  it("shows empty state when no recipes", () => {
    render(<RecipeList recipes={[]} onSelect={() => {}} />)

    expect(screen.getByText(/no recipes/i)).toBeInTheDocument()
  })
})
