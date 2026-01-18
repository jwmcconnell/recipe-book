import { describe, it, expect } from 'vitest';
import { RecipeRepository } from './recipe-repository';

describe('RecipeRepository', () => {
  it('createNull returns a repository instance', () => {
    const repository = RecipeRepository.createNull();

    expect(repository).toBeInstanceOf(RecipeRepository);
  });

  it('null repository starts empty', async () => {
    const repository = RecipeRepository.createNull();

    const recipes = await repository.findAll();

    expect(recipes).toEqual([]);
  });

  it('null repository can be seeded with initial recipes', async () => {
    const existingRecipe = {
      id: 'recipe-1',
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };
    const repository = RecipeRepository.createNull({
      recipes: [existingRecipe],
    });

    const recipes = await repository.findAll();

    expect(recipes).toEqual([existingRecipe]);
  });
  it('save returns recipe with generated id, createdAt, updatedAt', async () => {
    const repository = RecipeRepository.createNull();
    const recipeData = {
      name: 'Pancakes',
      type: 'food',
      ingredients: [{ name: 'flour', amount: 2, unit: 'cups' }],
      instructions: ['Mix', 'Cook'],
    };

    const saved = await repository.save(recipeData);

    expect(saved.id).toBeDefined();
    expect(saved.name).toBe('Pancakes');
    expect(saved.type).toBe('food');
    expect(saved.ingredients).toEqual([
      { name: 'flour', amount: 2, unit: 'cups' },
    ]);
    expect(saved.instructions).toEqual(['Mix', 'Cook']);
    expect(saved.createdAt).toBeInstanceOf(Date);
    expect(saved.updatedAt).toBeInstanceOf(Date);
  });
  it('findAll returns all saved recipes', async () => {
    const repository = RecipeRepository.createNull();
    await repository.save({
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });
    await repository.save({
      name: 'Margarita',
      type: 'drink',
      ingredients: [],
      instructions: [],
    });

    const recipes = await repository.findAll();

    expect(recipes).toHaveLength(2);
    expect(recipes[0].name).toBe('Pancakes');
    expect(recipes[1].name).toBe('Margarita');
  });
  it('findById returns recipe when it exists', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });

    const found = await repository.findById(saved.id);

    expect(found).toEqual(saved);
  });

  it('findById returns null when recipe does not exist', async () => {
    const repository = RecipeRepository.createNull();

    const found = await repository.findById('nonexistent-id');

    expect(found).toBeNull();
  });
  it('update changes fields and returns updated recipe', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });

    const updated = await repository.update(saved.id, {
      name: 'Belgian Waffles',
    });

    expect(updated?.name).toBe('Belgian Waffles');
    expect(updated?.type).toBe('food');
  });

  it('update changes updatedAt timestamp', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });
    const originalUpdatedAt = saved.updatedAt;

    await new Promise((r) => setTimeout(r, 10));
    const updated = await repository.update(saved.id, { name: 'Waffles' });

    expect(updated?.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime(),
    );
    expect(updated?.createdAt).toEqual(saved.createdAt);
  });

  it('update returns null when recipe does not exist', async () => {
    const repository = RecipeRepository.createNull();

    const result = await repository.update('nonexistent-id', { name: 'Test' });

    expect(result).toBeNull();
  });
  it('deleteById removes recipe and returns the deleted recipe', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });

    const deleted = await repository.deleteById(saved.id);

    expect(deleted).toEqual(saved);
    expect(await repository.findById(saved.id)).toBeNull();
  });

  it('deleteById returns null when recipe does not exist', async () => {
    const repository = RecipeRepository.createNull();

    const result = await repository.deleteById('nonexistent-id');

    expect(result).toBeNull();
  });
});
