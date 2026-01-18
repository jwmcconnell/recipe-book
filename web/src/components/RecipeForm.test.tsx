import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RecipeForm } from "./RecipeForm"
import { Recipe } from "@/domain/Recipe"

describe("RecipeForm", () => {
  describe("rendering", () => {
    it("shows 'New Recipe' title when no initialRecipe provided", () => {
      render(<RecipeForm onSubmit={() => {}} />)
      expect(screen.getByText("New Recipe")).toBeInTheDocument()
    })

    it("shows 'Edit Recipe' title when initialRecipe provided", () => {
      const recipe = new Recipe({
        name: "Test",
        type: "food",
        ingredients: [{ name: "Salt", amount: 1, unit: "tsp" }],
        instructions: ["Mix"],
      })
      render(<RecipeForm initialRecipe={recipe} onSubmit={() => {}} />)
      expect(screen.getByText("Edit Recipe")).toBeInTheDocument()
    })

    it("populates fields from initialRecipe", () => {
      const recipe = new Recipe({
        name: "Pasta",
        type: "food",
        ingredients: [{ name: "Noodles", amount: 200, unit: "g" }],
        instructions: ["Boil water", "Cook pasta"],
      })
      render(<RecipeForm initialRecipe={recipe} onSubmit={() => {}} />)

      expect(screen.getByDisplayValue("Pasta")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Noodles")).toBeInTheDocument()
      expect(screen.getByDisplayValue("200")).toBeInTheDocument()
      expect(screen.getByDisplayValue("g")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Boil water")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Cook pasta")).toBeInTheDocument()
    })
  })

  describe("ingredients", () => {
    it("adds a new ingredient row when clicking Add", async () => {
      const user = userEvent.setup()
      render(<RecipeForm onSubmit={() => {}} />)

      const addButtons = screen.getAllByRole("button", { name: /add/i })
      const addIngredientButton = addButtons[0]

      const initialInputs = screen.getAllByPlaceholderText("Name")
      expect(initialInputs).toHaveLength(1)

      await user.click(addIngredientButton)

      const updatedInputs = screen.getAllByPlaceholderText("Name")
      expect(updatedInputs).toHaveLength(2)
    })

    it("removes an ingredient row when clicking remove", async () => {
      const user = userEvent.setup()
      const recipe = new Recipe({
        name: "Test",
        type: "food",
        ingredients: [
          { name: "Salt", amount: 1, unit: "tsp" },
          { name: "Pepper", amount: 1, unit: "tsp" },
        ],
        instructions: ["Mix"],
      })
      render(<RecipeForm initialRecipe={recipe} onSubmit={() => {}} />)

      expect(screen.getByDisplayValue("Salt")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Pepper")).toBeInTheDocument()

      const removeButtons = screen.getAllByRole("button", { name: "" })
      await user.click(removeButtons[0])

      expect(screen.queryByDisplayValue("Salt")).not.toBeInTheDocument()
      expect(screen.getByDisplayValue("Pepper")).toBeInTheDocument()
    })

    it("disables remove button when only one ingredient exists", () => {
      render(<RecipeForm onSubmit={() => {}} />)
      const trashButtons = screen.getAllByRole("button", { name: "" })
      expect(trashButtons[0]).toBeDisabled()
    })
  })

  describe("instructions", () => {
    it("adds a new instruction row when clicking Add", async () => {
      const user = userEvent.setup()
      render(<RecipeForm onSubmit={() => {}} />)

      const addButtons = screen.getAllByRole("button", { name: /add/i })
      const addInstructionButton = addButtons[1]

      const initialTextareas = screen.getAllByRole("textbox").filter(
        (el) => el.tagName === "TEXTAREA"
      )
      expect(initialTextareas).toHaveLength(1)

      await user.click(addInstructionButton)

      const updatedTextareas = screen.getAllByRole("textbox").filter(
        (el) => el.tagName === "TEXTAREA"
      )
      expect(updatedTextareas).toHaveLength(2)
    })

    it("removes an instruction row when clicking remove", async () => {
      const user = userEvent.setup()
      const recipe = new Recipe({
        name: "Test",
        type: "food",
        ingredients: [{ name: "Salt", amount: 1, unit: "tsp" }],
        instructions: ["Step one", "Step two"],
      })
      render(<RecipeForm initialRecipe={recipe} onSubmit={() => {}} />)

      expect(screen.getByDisplayValue("Step one")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Step two")).toBeInTheDocument()

      const removeButtons = screen.getAllByRole("button", { name: "" })
      const instructionRemoveButton = removeButtons[1]
      await user.click(instructionRemoveButton)

      expect(screen.queryByDisplayValue("Step one")).not.toBeInTheDocument()
      expect(screen.getByDisplayValue("Step two")).toBeInTheDocument()
    })
  })

  describe("form submission", () => {
    it("calls onSubmit with a valid Recipe when submitted", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<RecipeForm onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText("Name"), "Scrambled Eggs")
      await user.type(screen.getAllByPlaceholderText("Name")[0], "Eggs")
      await user.type(screen.getByPlaceholderText("Amount"), "2")
      await user.type(screen.getByPlaceholderText("Unit"), "whole")
      await user.type(screen.getByPlaceholderText("Step 1"), "Beat eggs and cook")

      await user.click(screen.getByRole("button", { name: /create recipe/i }))

      expect(onSubmit).toHaveBeenCalledTimes(1)
      const submittedRecipe = onSubmit.mock.calls[0][0]
      expect(submittedRecipe).toBeInstanceOf(Recipe)
      expect(submittedRecipe.name).toBe("Scrambled Eggs")
      expect(submittedRecipe.type).toBe("food")
      expect(submittedRecipe.ingredients).toEqual([
        { name: "Eggs", amount: 2, unit: "whole" },
      ])
      expect(submittedRecipe.instructions).toEqual(["Beat eggs and cook"])
    })

    it("filters out empty ingredients and instructions on submit", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<RecipeForm onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText("Name"), "Simple Recipe")

      await user.click(screen.getByRole("button", { name: /create recipe/i }))

      const submittedRecipe = onSubmit.mock.calls[0][0]
      expect(submittedRecipe.ingredients).toEqual([])
      expect(submittedRecipe.instructions).toEqual([])
    })
  })

  describe("cancel button", () => {
    it("does not show cancel button when onCancel not provided", () => {
      render(<RecipeForm onSubmit={() => {}} />)
      expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument()
    })

    it("shows cancel button when onCancel provided", () => {
      render(<RecipeForm onSubmit={() => {}} onCancel={() => {}} />)
      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
    })

    it("calls onCancel when cancel button clicked", async () => {
      const user = userEvent.setup()
      const onCancel = vi.fn()
      render(<RecipeForm onSubmit={() => {}} onCancel={onCancel} />)

      await user.click(screen.getByRole("button", { name: /cancel/i }))

      expect(onCancel).toHaveBeenCalledTimes(1)
    })
  })
})
