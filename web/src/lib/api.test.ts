import { describe, it, expect, vi, afterEach } from "vitest"
import { getRecipes, getRecipe, updateRecipe, deleteRecipe } from "./api"

describe("API", () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
  })

  function mockFetch(response: unknown, status = 200) {
    global.fetch = vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
    })
    return global.fetch as ReturnType<typeof vi.fn>
  }

  describe("getRecipes", () => {
    it("fetches all recipes for user", async () => {
      const recipes = [
        { id: "1", name: "Pasta", type: "food" },
        { id: "2", name: "Smoothie", type: "drink" },
      ]
      const fetchMock = mockFetch(recipes)

      const result = await getRecipes("test-token")

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/recipes"),
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: "Bearer test-token",
          },
        })
      )
      expect(result).toEqual(recipes)
    })
  })

  describe("getRecipe", () => {
    it("fetches single recipe by id", async () => {
      const recipe = { id: "abc-123", name: "Pasta", type: "food" }
      const fetchMock = mockFetch(recipe)

      const result = await getRecipe("test-token", "abc-123")

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/recipes/abc-123"),
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: "Bearer test-token",
          },
        })
      )
      expect(result).toEqual(recipe)
    })
  })
  describe("updateRecipe", () => {
    it("sends PUT request with recipe data", async () => {
      const updatedRecipe = { id: "abc-123", name: "Updated Pasta", type: "food" }
      const fetchMock = mockFetch(updatedRecipe)
      const updateData = { name: "Updated Pasta" }

      const result = await updateRecipe("test-token", "abc-123", updateData)

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/recipes/abc-123"),
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
          },
          body: JSON.stringify(updateData),
        })
      )
      expect(result).toEqual(updatedRecipe)
    })
  })
  describe("deleteRecipe", () => {
    it("sends DELETE request", async () => {
      const fetchMock = mockFetch({})

      await deleteRecipe("test-token", "abc-123")

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/recipes/abc-123"),
        expect.objectContaining({
          method: "DELETE",
          headers: {
            Authorization: "Bearer test-token",
          },
        })
      )
    })
  })
})
