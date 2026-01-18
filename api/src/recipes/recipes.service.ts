import { Injectable } from '@nestjs/common';
import { RecipeRepository, Recipe, RecipeInput } from './recipe-repository';

@Injectable()
export class RecipesService {
  constructor(private repository: RecipeRepository) {}

  create(data: RecipeInput): Promise<Recipe> {
    return this.repository.save(data);
  }

  findAll(): Promise<Recipe[]> {
    return this.repository.findAll();
  }

  findOne(id: string): Promise<Recipe | null> {
    return this.repository.findById(id);
  }

  update(id: string, data: Partial<RecipeInput>): Promise<Recipe | null> {
    return this.repository.update(id, data);
  }

  delete(id: string): Promise<Recipe | null> {
    return this.repository.deleteById(id);
  }
}
