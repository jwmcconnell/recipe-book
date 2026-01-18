import { Prisma, PrismaClient, Recipe as PrismaRecipe } from '@prisma/client';

export type Recipe = PrismaRecipe;

export interface RecipeInput {
  userId: string;
  name: string;
  type: string;
  ingredients: Prisma.InputJsonValue;
  instructions: Prisma.InputJsonValue;
}

export type CreateRecipeDto = Omit<RecipeInput, 'userId'>;

interface RecipeStore {
  findAll(userId: string): Promise<Recipe[]>;
  findById(id: string, userId: string): Promise<Recipe | null>;
  save(data: RecipeInput): Promise<Recipe>;
  update(
    id: string,
    userId: string,
    data: Partial<CreateRecipeDto>,
  ): Promise<Recipe | null>;
  deleteById(id: string, userId: string): Promise<Recipe | null>;
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

  async findAll(userId: string): Promise<Recipe[]> {
    return this.store.findAll(userId);
  }

  async findById(id: string, userId: string): Promise<Recipe | null> {
    return this.store.findById(id, userId);
  }

  async deleteById(id: string, userId: string): Promise<Recipe | null> {
    return this.store.deleteById(id, userId);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateRecipeDto>,
  ): Promise<Recipe | null> {
    return this.store.update(id, userId, data);
  }

  async save(data: RecipeInput): Promise<Recipe> {
    return this.store.save(data);
  }
}

class PrismaRecipeStore implements RecipeStore {
  constructor(private prisma: PrismaClient) {}

  async findAll(userId: string): Promise<Recipe[]> {
    return this.prisma.recipe.findMany({ where: { userId } });
  }

  async findById(id: string, userId: string): Promise<Recipe | null> {
    return this.prisma.recipe.findFirst({ where: { id, userId } });
  }

  async save(data: RecipeInput): Promise<Recipe> {
    return this.prisma.recipe.create({ data });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateRecipeDto>,
  ): Promise<Recipe | null> {
    const recipe = await this.prisma.recipe.findFirst({
      where: { id, userId },
    });
    if (!recipe) return null;
    return this.prisma.recipe.update({ where: { id }, data });
  }

  async deleteById(id: string, userId: string): Promise<Recipe | null> {
    const recipe = await this.prisma.recipe.findFirst({
      where: { id, userId },
    });
    if (!recipe) return null;
    return this.prisma.recipe.delete({ where: { id } });
  }
}

class InMemoryRecipeStore implements RecipeStore {
  constructor(private recipes: Recipe[] = []) {}

  findAll(userId: string): Promise<Recipe[]> {
    return Promise.resolve(this.recipes.filter((r) => r.userId === userId));
  }

  findById(id: string, userId: string): Promise<Recipe | null> {
    return Promise.resolve(
      this.recipes.find((r) => r.id === id && r.userId === userId) ?? null,
    );
  }

  save(data: RecipeInput): Promise<Recipe> {
    const now = new Date();
    const recipe = {
      id: crypto.randomUUID(),
      userId: data.userId,
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

  update(
    id: string,
    userId: string,
    data: Partial<CreateRecipeDto>,
  ): Promise<Recipe | null> {
    const index = this.recipes.findIndex(
      (r) => r.id === id && r.userId === userId,
    );
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

  deleteById(id: string, userId: string): Promise<Recipe | null> {
    const index = this.recipes.findIndex(
      (r) => r.id === id && r.userId === userId,
    );
    if (index === -1) return Promise.resolve(null);

    const [deleted] = this.recipes.splice(index, 1);
    return Promise.resolve(deleted);
  }
}
