interface GroceryItemProps {
  id: string;
  listId: string;
  name: string;
  quantity?: string | null;
  checked: boolean;
}

export class GroceryItem {
  readonly id: string;
  readonly listId: string;
  readonly name: string;
  readonly quantity: string | null;
  readonly checked: boolean;

  constructor(props: GroceryItemProps) {
    this.id = props.id;
    this.listId = props.listId;
    this.name = props.name;
    this.quantity = props.quantity ?? null;
    this.checked = props.checked;
  }

  withChecked(checked: boolean): GroceryItem {
    return new GroceryItem({ ...this, checked });
  }
}
