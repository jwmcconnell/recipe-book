import { Injectable } from '@nestjs/common';
import {
  RecipeRepository,
  Recipe,
  RecipeInput,
  CreateRecipeDto,
} from './recipe-repository';

@Injectable()
export class RecipesService {
  constructor(private repository: RecipeRepository) {}

  create(data: RecipeInput): Promise<Recipe> {
    return this.repository.save(data);
  }

  findAll(userId: string): Promise<Recipe[]> {
    return this.repository.findAll(userId);
  }

  findOne(id: string, userId: string): Promise<Recipe | null> {
    return this.repository.findById(id, userId);
  }

  update(
    id: string,
    userId: string,
    data: Partial<CreateRecipeDto>,
  ): Promise<Recipe | null> {
    return this.repository.update(id, userId, data);
  }

  delete(id: string, userId: string): Promise<Recipe | null> {
    return this.repository.deleteById(id, userId);
  }
}
