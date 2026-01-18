import { Prisma, PrismaClient, Recipe as PrismaRecipe } from '@prisma/client';

export type Recipe = PrismaRecipe;

export interface RecipeInput {
  name: string;
  type: string;
  ingredients: Prisma.InputJsonValue;
  instructions: Prisma.InputJsonValue;
}

interface RecipeStore {
  findAll(): Promise<Recipe[]>;
  findById(id: string): Promise<Recipe | null>;
  save(data: RecipeInput): Promise<Recipe>;
  update(id: string, data: Partial<RecipeInput>): Promise<Recipe | null>;
  deleteById(id: string): Promise<Recipe | null>;
}

interface NullOptions {
  recipes?: Recipe[];
}

export class RecipeRepository {
  private constructor(private store: RecipeStore) {}

  static create(prisma: PrismaClient): RecipeRepository {
    return new RecipeRepository(new PrismaRecipeStore(prisma));
  }

  static createNull(options: NullOptions = {}): RecipeRepository {
    return new RecipeRepository(new InMemoryRecipeStore(options.recipes ?? []));
  }

  async findAll(): Promise<Recipe[]> {
    return this.store.findAll();
  }

  async findById(id: string): Promise<Recipe | null> {
    return this.store.findById(id);
  }

  async deleteById(id: string): Promise<Recipe | null> {
    return this.store.deleteById(id);
  }

  async update(id: string, data: Partial<RecipeInput>): Promise<Recipe | null> {
    return this.store.update(id, data);
  }

  async save(data: RecipeInput): Promise<Recipe> {
    return this.store.save(data);
  }
}

class PrismaRecipeStore implements RecipeStore {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Recipe[]> {
    return this.prisma.recipe.findMany();
  }

  async findById(id: string): Promise<Recipe | null> {
    return this.prisma.recipe.findUnique({ where: { id } });
  }

  async save(data: RecipeInput): Promise<Recipe> {
    return this.prisma.recipe.create({ data });
  }

  async update(id: string, data: Partial<RecipeInput>): Promise<Recipe | null> {
    return this.prisma.recipe.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<Recipe | null> {
    return this.prisma.recipe.delete({ where: { id } });
  }
}

class InMemoryRecipeStore implements RecipeStore {
  constructor(private recipes: Recipe[] = []) {}

  findAll(): Promise<Recipe[]> {
    return Promise.resolve(this.recipes);
  }

  findById(id: string): Promise<Recipe | null> {
    return Promise.resolve(this.recipes.find((r) => r.id === id) ?? null);
  }

  save(data: RecipeInput): Promise<Recipe> {
    const now = new Date();
    const recipe = {
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type,
      ingredients: data.ingredients,
      instructions: data.instructions,
      createdAt: now,
      updatedAt: now,
    } as Recipe;
    this.recipes.push(recipe);
    return Promise.resolve(recipe);
  }

  update(id: string, data: Partial<RecipeInput>): Promise<Recipe | null> {
    const index = this.recipes.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(null);

    const existing = this.recipes[index];
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    } as Recipe;
    this.recipes[index] = updated;
    return Promise.resolve(updated);
  }

  deleteById(id: string): Promise<Recipe | null> {
    const index = this.recipes.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(null);

    const [deleted] = this.recipes.splice(index, 1);
    return Promise.resolve(deleted);
  }
}
