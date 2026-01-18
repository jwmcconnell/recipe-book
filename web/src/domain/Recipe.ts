type RecipeType = "food" | "drink";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface RecipeProps {
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  type: RecipeType;
}

export class Recipe {
  readonly name: string;
  readonly ingredients: Ingredient[];
  readonly instructions: string[];
  readonly type: RecipeType;

  constructor(props: RecipeProps) {
    this.name = props.name;
    this.ingredients = props.ingredients;
    this.instructions = props.instructions;
    this.type = props.type;
  }
}
