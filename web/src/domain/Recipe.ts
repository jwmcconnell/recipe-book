type RecipeType = "food" | "drink";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface RecipeProps {
  id?: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  type: RecipeType;
}

export class Recipe {
  readonly id?: string;
  readonly name: string;
  readonly ingredients: Ingredient[];
  readonly instructions: string[];
  readonly type: RecipeType;

  constructor(props: RecipeProps) {
    this.id = props.id;
    this.name = props.name;
    this.ingredients = props.ingredients;
    this.instructions = props.instructions;
    this.type = props.type;
  }
}
