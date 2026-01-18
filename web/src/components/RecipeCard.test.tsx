import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RecipeCard } from "./RecipeCard"
import { Recipe } from "@/domain/Recipe"

describe("RecipeCard", () => {
  const sampleRecipe = new Recipe({
    id: "abc-123",
    name: "Spaghetti Bolognese",
    type: "food",
    ingredients: [
      { name: "Pasta", amount: 500, unit: "g" },
      { name: "Ground beef", amount: 400, unit: "g" },
      { name: "Tomato sauce", amount: 2, unit: "cups" },
    ],
    instructions: ["Boil pasta", "Cook beef", "Mix together"],
  })

  it("displays recipe name", () => {
    render(<RecipeCard recipe={sampleRecipe} onClick={() => {}} />)

    expect(screen.getByText("Spaghetti Bolognese")).toBeInTheDocument()
  })

  it("shows recipe type as badge", () => {
    render(<RecipeCard recipe={sampleRecipe} onClick={() => {}} />)

    expect(screen.getByText("food")).toBeInTheDocument()
  })
  it("shows ingredient count", () => {
    render(<RecipeCard recipe={sampleRecipe} onClick={() => {}} />)

    expect(screen.getByText("3 ingredients")).toBeInTheDocument()
  })
  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn()
    render(<RecipeCard recipe={sampleRecipe} onClick={handleClick} />)

    await userEvent.click(screen.getByText("Spaghetti Bolognese"))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
