import { useState, useEffect } from 'react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from '@clerk/clerk-react'
import { RecipeForm } from '@/components/RecipeForm'
import { RecipeList } from '@/components/RecipeList'
import { RecipeDetail } from '@/components/RecipeDetail'
import { GroceryListView } from '@/components/GroceryListView'
import { Recipe } from '@/domain/Recipe'
import { GroceryList } from '@/domain/GroceryList'
import { GroceryItem } from '@/domain/GroceryItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { IconPlus } from '@tabler/icons-react'
import {
  createRecipe,
  getRecipes,
  updateRecipe,
  deleteRecipe,
  getGroceryLists,
  getGroceryList,
  createGroceryList,
  deleteGroceryList,
  addGroceryItem,
  updateGroceryItem,
  deleteGroceryItem,
} from '@/lib/api'

type Section = 'recipes' | 'grocery'
type RecipeView = 'list' | 'detail' | 'create' | 'edit'
type GroceryView = 'list' | 'detail'

interface ApiRecipe {
  id: string
  name: string
  type: 'food' | 'drink'
  ingredients: { name: string; amount: number; unit: string }[]
  instructions: string[]
}

interface ApiGroceryList {
  id: string
  name: string
  items?: ApiGroceryItem[]
}

interface ApiGroceryItem {
  id: string
  listId: string
  name: string
  quantity: string | null
  checked: boolean
}

function toRecipe(apiRecipe: ApiRecipe): Recipe {
  return new Recipe({
    id: apiRecipe.id,
    name: apiRecipe.name,
    type: apiRecipe.type,
    ingredients: apiRecipe.ingredients,
    instructions: apiRecipe.instructions,
  })
}

function toGroceryList(apiList: ApiGroceryList): GroceryList {
  return new GroceryList({
    id: apiList.id,
    name: apiList.name,
    items: apiList.items?.map(toGroceryItem) ?? [],
  })
}

function toGroceryItem(apiItem: ApiGroceryItem): GroceryItem {
  return new GroceryItem({
    id: apiItem.id,
    listId: apiItem.listId,
    name: apiItem.name,
    quantity: apiItem.quantity,
    checked: apiItem.checked,
  })
}

export function App() {
  const { getToken } = useAuth()
  const [section, setSection] = useState<Section>('recipes')
  const [recipeView, setRecipeView] = useState<RecipeView>('list')
  const [groceryView, setGroceryView] = useState<GroceryView>('list')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([])
  const [selectedGroceryList, setSelectedGroceryList] = useState<GroceryList | null>(null)
  const [loading, setLoading] = useState(true)
  const [newListName, setNewListName] = useState('')

  useEffect(() => {
    if (section === 'recipes') {
      loadRecipes()
    } else {
      loadGroceryLists()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section])

  async function loadRecipes() {
    const token = await getToken()
    if (!token) return

    try {
      setLoading(true)
      const data = await getRecipes(token)
      setRecipes(data.map(toRecipe))
    } catch (error) {
      console.error('Failed to load recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadGroceryLists() {
    const token = await getToken()
    if (!token) return

    try {
      setLoading(true)
      const data = await getGroceryLists(token)
      setGroceryLists(data.map(toGroceryList))
    } catch (error) {
      console.error('Failed to load grocery lists:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadGroceryListDetail(id: string) {
    const token = await getToken()
    if (!token) return

    try {
      const data = await getGroceryList(token, id)
      setSelectedGroceryList(toGroceryList(data))
    } catch (error) {
      console.error('Failed to load grocery list:', error)
    }
  }

  async function handleCreateRecipe(recipe: Recipe) {
    const token = await getToken()
    if (!token) return

    try {
      await createRecipe(token, {
        name: recipe.name,
        type: recipe.type,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      })
      await loadRecipes()
      setRecipeView('list')
    } catch (error) {
      console.error('Failed to create recipe:', error)
    }
  }

  async function handleUpdateRecipe(recipe: Recipe) {
    const token = await getToken()
    if (!token || !selectedRecipe?.id) return

    try {
      await updateRecipe(token, selectedRecipe.id, {
        name: recipe.name,
        type: recipe.type,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      })
      await loadRecipes()
      setRecipeView('list')
      setSelectedRecipe(null)
    } catch (error) {
      console.error('Failed to update recipe:', error)
    }
  }

  async function handleDeleteRecipe() {
    const token = await getToken()
    if (!token || !selectedRecipe?.id) return

    try {
      await deleteRecipe(token, selectedRecipe.id)
      await loadRecipes()
      setRecipeView('list')
      setSelectedRecipe(null)
    } catch (error) {
      console.error('Failed to delete recipe:', error)
    }
  }

  function handleSelectRecipe(recipe: Recipe) {
    setSelectedRecipe(recipe)
    setRecipeView('detail')
  }

  async function handleCreateGroceryList(e: React.FormEvent) {
    e.preventDefault()
    if (!newListName.trim()) return

    const token = await getToken()
    if (!token) return

    try {
      await createGroceryList(token, { name: newListName.trim() })
      setNewListName('')
      await loadGroceryLists()
    } catch (error) {
      console.error('Failed to create grocery list:', error)
    }
  }

  async function handleDeleteGroceryList() {
    const token = await getToken()
    if (!token || !selectedGroceryList) return

    try {
      await deleteGroceryList(token, selectedGroceryList.id)
      setSelectedGroceryList(null)
      setGroceryView('list')
      await loadGroceryLists()
    } catch (error) {
      console.error('Failed to delete grocery list:', error)
    }
  }

  function handleSelectGroceryList(list: GroceryList) {
    loadGroceryListDetail(list.id)
    setGroceryView('detail')
  }

  async function handleAddItem(name: string, quantity?: string) {
    const token = await getToken()
    if (!token || !selectedGroceryList) return

    try {
      await addGroceryItem(token, selectedGroceryList.id, { name, quantity })
      await loadGroceryListDetail(selectedGroceryList.id)
    } catch (error) {
      console.error('Failed to add item:', error)
    }
  }

  async function handleToggleItem(item: GroceryItem) {
    const token = await getToken()
    if (!token || !selectedGroceryList) return

    try {
      await updateGroceryItem(token, selectedGroceryList.id, item.id, {
        checked: !item.checked,
      })
      await loadGroceryListDetail(selectedGroceryList.id)
    } catch (error) {
      console.error('Failed to toggle item:', error)
    }
  }

  async function handleDeleteItem(item: GroceryItem) {
    const token = await getToken()
    if (!token || !selectedGroceryList) return

    try {
      await deleteGroceryItem(token, selectedGroceryList.id, item.id)
      await loadGroceryListDetail(selectedGroceryList.id)
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  function renderRecipeContent() {
    if (loading && recipeView === 'list') {
      return <p className="text-center text-muted-foreground">Loading...</p>
    }

    switch (recipeView) {
      case 'list':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">My Recipes</h1>
              <Button onClick={() => setRecipeView('create')}>
                <IconPlus className="size-4" />
                New Recipe
              </Button>
            </div>
            <RecipeList recipes={recipes} onSelect={handleSelectRecipe} />
          </div>
        )

      case 'detail':
        if (!selectedRecipe) return null
        return (
          <RecipeDetail
            recipe={selectedRecipe}
            onEdit={() => setRecipeView('edit')}
            onDelete={handleDeleteRecipe}
            onBack={() => {
              setRecipeView('list')
              setSelectedRecipe(null)
            }}
          />
        )

      case 'create':
        return (
          <RecipeForm
            onSubmit={handleCreateRecipe}
            onCancel={() => setRecipeView('list')}
          />
        )

      case 'edit':
        if (!selectedRecipe) return null
        return (
          <RecipeForm
            initialRecipe={selectedRecipe}
            onSubmit={handleUpdateRecipe}
            onCancel={() => setRecipeView('detail')}
          />
        )
    }
  }

  function renderGroceryContent() {
    if (loading && groceryView === 'list') {
      return <p className="text-center text-muted-foreground">Loading...</p>
    }

    switch (groceryView) {
      case 'list':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Grocery Lists</h1>
            <form onSubmit={handleCreateGroceryList} className="flex gap-2">
              <Input
                placeholder="New list name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
              <Button type="submit">
                <IconPlus className="size-4" />
                Create
              </Button>
            </form>
            {groceryLists.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No grocery lists yet
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groceryLists.map((list) => (
                  <Card
                    key={list.id}
                    size="sm"
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSelectGroceryList(list)}
                  >
                    <CardHeader>
                      <CardTitle>{list.name}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 'detail':
        if (!selectedGroceryList) return null
        return (
          <GroceryListView
            list={selectedGroceryList}
            onBack={() => {
              setGroceryView('list')
              setSelectedGroceryList(null)
            }}
            onDeleteList={handleDeleteGroceryList}
            onAddItem={handleAddItem}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
          />
        )
    }
  }

  function renderContent() {
    if (section === 'recipes') {
      return renderRecipeContent()
    }
    return renderGroceryContent()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <SignedIn>
          <nav className="flex gap-2">
            <Button
              variant={section === 'recipes' ? 'default' : 'ghost'}
              onClick={() => {
                setSection('recipes')
                setRecipeView('list')
              }}
            >
              Recipes
            </Button>
            <Button
              variant={section === 'grocery' ? 'default' : 'ghost'}
              onClick={() => {
                setSection('grocery')
                setGroceryView('list')
              }}
            >
              Grocery
            </Button>
          </nav>
        </SignedIn>
        <SignedOut>
          <div />
        </SignedOut>
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <main className="p-8">
        <SignedIn>{renderContent()}</SignedIn>
        <SignedOut>
          <p className="text-center text-muted-foreground">
            Sign in to manage your recipes
          </p>
        </SignedOut>
      </main>
    </div>
  )
}

export default App
