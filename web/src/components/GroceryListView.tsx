import { useState } from 'react'
import { GroceryList } from '@/domain/GroceryList'
import { GroceryItem } from '@/domain/GroceryItem'
import { GroceryItemRow } from './GroceryItemRow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconArrowLeft, IconTrash, IconPlus } from '@tabler/icons-react'

interface GroceryListViewProps {
  list: GroceryList
  onBack: () => void
  onDeleteList: () => void
  onAddItem: (name: string, quantity?: string) => void
  onToggleItem: (item: GroceryItem) => void
  onDeleteItem: (item: GroceryItem) => void
}

export function GroceryListView({
  list,
  onBack,
  onDeleteList,
  onAddItem,
  onToggleItem,
  onDeleteItem,
}: GroceryListViewProps) {
  const [newItemName, setNewItemName] = useState('')

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault()
    if (!newItemName.trim()) return
    onAddItem(newItemName.trim())
    setNewItemName('')
  }

  const uncheckedItems = list.items.filter((item) => !item.checked)
  const checkedItems = list.items.filter((item) => item.checked)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <IconArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">{list.name}</h1>
        <Button variant="ghost" size="icon" onClick={onDeleteList}>
          <IconTrash className="size-5 text-destructive" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
            <Input
              placeholder="Add an item..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <Button type="submit" size="icon">
              <IconPlus className="size-4" />
            </Button>
          </form>

          {list.items.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No items yet
            </p>
          ) : (
            <>
              {uncheckedItems.map((item) => (
                <GroceryItemRow
                  key={item.id}
                  item={item}
                  onToggle={onToggleItem}
                  onDelete={onDeleteItem}
                />
              ))}
              {checkedItems.length > 0 && uncheckedItems.length > 0 && (
                <div className="border-t my-4" />
              )}
              {checkedItems.map((item) => (
                <GroceryItemRow
                  key={item.id}
                  item={item}
                  onToggle={onToggleItem}
                  onDelete={onDeleteItem}
                />
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
