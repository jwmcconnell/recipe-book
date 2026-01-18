import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RecipeDetail } from "./RecipeDetail"
import { Recipe } from "@/domain/Recipe"

describe("RecipeDetail", () => {
  const recipe = new Recipe({
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
    render(
      <RecipeDetail
        recipe={recipe}
        onEdit={() => {}}
        onDelete={() => {}}
        onBack={() => {}}
      />
    )

    expect(screen.getByText("Spaghetti Bolognese")).toBeInTheDocument()
  })

  it("shows recipe type", () => {
    render(
      <RecipeDetail
        recipe={recipe}
        onEdit={() => {}}
        onDelete={() => {}}
        onBack={() => {}}
      />
    )

    expect(screen.getByText("food")).toBeInTheDocument()
  })

  it("lists all ingredients", () => {
    render(
      <RecipeDetail
        recipe={recipe}
        onEdit={() => {}}
        onDelete={() => {}}
        onBack={() => {}}
      />
    )

    expect(screen.getByText(/Pasta/)).toBeInTheDocument()
    expect(screen.getByText(/500/)).toBeInTheDocument()
    expect(screen.getByText(/Ground beef/)).toBeInTheDocument()
    expect(screen.getByText(/Tomato sauce/)).toBeInTheDocument()
  })

  it("shows numbered instructions", () => {
    render(
      <RecipeDetail
        recipe={recipe}
        onEdit={() => {}}
        onDelete={() => {}}
        onBack={() => {}}
      />
    )

    expect(screen.getByText(/1.*Boil pasta/)).toBeInTheDocument()
    expect(screen.getByText(/2.*Cook beef/)).toBeInTheDocument()
    expect(screen.getByText(/3.*Mix together/)).toBeInTheDocument()
  })

  it("calls onEdit when Edit button is clicked", async () => {
    const handleEdit = vi.fn()
    render(
      <RecipeDetail
        recipe={recipe}
        onEdit={handleEdit}
        onDelete={() => {}}
        onBack={() => {}}
      />
    )

    await userEvent.click(screen.getByRole("button", { name: /edit/i }))

    expect(handleEdit).toHaveBeenCalledTimes(1)
  })

  it("calls onDelete when Delete button is clicked", async () => {
    const handleDelete = vi.fn()
    render(
      <RecipeDetail
        recipe={recipe}
        onEdit={() => {}}
        onDelete={handleDelete}
        onBack={() => {}}
      />
    )

    await userEvent.click(screen.getByRole("button", { name: /delete/i }))

    expect(handleDelete).toHaveBeenCalledTimes(1)
  })

  it("calls onBack when Back button is clicked", async () => {
    const handleBack = vi.fn()
    render(
      <RecipeDetail
        recipe={recipe}
        onEdit={() => {}}
        onDelete={() => {}}
        onBack={handleBack}
      />
    )

    await userEvent.click(screen.getByRole("button", { name: /back/i }))

    expect(handleBack).toHaveBeenCalledTimes(1)
  })
})
