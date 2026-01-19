import { GroceryItem } from '@/domain/GroceryItem'
import { Button } from '@/components/ui/button'
import { IconTrash } from '@tabler/icons-react'

interface GroceryItemRowProps {
  item: GroceryItem
  onToggle: (item: GroceryItem) => void
  onDelete: (item: GroceryItem) => void
}

export function GroceryItemRow({ item, onToggle, onDelete }: GroceryItemRowProps) {
  return (
    <div className="flex items-center gap-3 py-2 group">
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => onToggle(item)}
        className="size-5 rounded border-input accent-primary cursor-pointer"
      />
      <span
        className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
      >
        {item.name}
        {item.quantity && (
          <span className="text-muted-foreground ml-2">({item.quantity})</span>
        )}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(item)}
      >
        <IconTrash className="size-4 text-muted-foreground" />
      </Button>
    </div>
  )
}
