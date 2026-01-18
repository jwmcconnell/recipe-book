import { describe, it, expect } from "vitest";
import { Recipe } from "./Recipe";

describe("Recipe", () => {
  it("can have an optional id", () => {
    const recipeWithId = new Recipe({
      id: "abc-123",
      name: "Test",
      ingredients: [],
      instructions: [],
      type: "food",
    });
    expect(recipeWithId.id).toBe("abc-123");

    const recipeWithoutId = new Recipe({
      name: "Test",
      ingredients: [],
      instructions: [],
      type: "food",
    });
    expect(recipeWithoutId.id).toBeUndefined();
  });

  it("can be created with name, ingredients, instructions, and type", () => {
    const recipe = new Recipe({
      name: "Margarita",
      ingredients: [
        { name: "Tequila", amount: 2, unit: "oz" },
        { name: "Lime juice", amount: 1, unit: "oz" },
        { name: "Triple sec", amount: 1, unit: "oz" },
      ],
      instructions: ["Combine ingredients in shaker", "Shake with ice", "Strain into glass"],
      type: "drink",
    });

    expect(recipe.name).toBe("Margarita");
    expect(recipe.ingredients).toHaveLength(3);
    expect(recipe.instructions).toHaveLength(3);
    expect(recipe.type).toBe("drink");
  });
});
