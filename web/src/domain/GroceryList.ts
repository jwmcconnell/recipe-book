import { GroceryItem } from './GroceryItem';

interface GroceryListProps {
  id: string;
  name: string;
  items?: GroceryItem[];
}

export class GroceryList {
  readonly id: string;
  readonly name: string;
  readonly items: GroceryItem[];

  constructor(props: GroceryListProps) {
    this.id = props.id;
    this.name = props.name;
    this.items = props.items ?? [];
  }
}
