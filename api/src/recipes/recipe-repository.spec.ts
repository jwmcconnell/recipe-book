import { describe, it, expect } from 'vitest';
import { RecipeRepository } from './recipe-repository';

describe('RecipeRepository', () => {
  it('createNull returns a repository instance', () => {
    const repository = RecipeRepository.createNull();

    expect(repository).toBeInstanceOf(RecipeRepository);
  });

  it('null repository starts empty', async () => {
    const repository = RecipeRepository.createNull();

    const recipes = await repository.findAll('any-user');

    expect(recipes).toEqual([]);
  });

  it('null repository can be seeded with initial recipes', async () => {
    const existingRecipe = {
      id: 'recipe-1',
      userId: 'user-1',
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

    const recipes = await repository.findAll('user-1');

    expect(recipes).toEqual([existingRecipe]);
  });
  it('save returns recipe with generated id, createdAt, updatedAt', async () => {
    const repository = RecipeRepository.createNull();
    const recipeData = {
      userId: 'user-1',
      name: 'Pancakes',
      type: 'food',
      ingredients: [{ name: 'flour', amount: 2, unit: 'cups' }],
      instructions: ['Mix', 'Cook'],
    };

    const saved = await repository.save(recipeData);

    expect(saved.id).toBeDefined();
    expect(saved.userId).toBe('user-1');
    expect(saved.name).toBe('Pancakes');
    expect(saved.type).toBe('food');
    expect(saved.ingredients).toEqual([
      { name: 'flour', amount: 2, unit: 'cups' },
    ]);
    expect(saved.instructions).toEqual(['Mix', 'Cook']);
    expect(saved.createdAt).toBeInstanceOf(Date);
    expect(saved.updatedAt).toBeInstanceOf(Date);
  });
  it('findAll returns only recipes for the given user', async () => {
    const repository = RecipeRepository.createNull();
    await repository.save({
      userId: 'user-1',
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });
    await repository.save({
      userId: 'user-2',
      name: 'Margarita',
      type: 'drink',
      ingredients: [],
      instructions: [],
    });

    const recipes = await repository.findAll('user-1');

    expect(recipes).toHaveLength(1);
    expect(recipes[0].name).toBe('Pancakes');
  });
  it('findById returns recipe when it exists and user is owner', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      userId: 'user-1',
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });

    const found = await repository.findById(saved.id, 'user-1');

    expect(found).toEqual(saved);
  });

  it('findById returns null when recipe does not exist', async () => {
    const repository = RecipeRepository.createNull();

    const found = await repository.findById('nonexistent-id', 'user-1');

    expect(found).toBeNull();
  });

  it('findById returns null when recipe belongs to different user', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      userId: 'user-1',
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });

    const found = await repository.findById(saved.id, 'user-2');

    expect(found).toBeNull();
  });
  it('update changes fields and returns updated recipe', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      userId: 'user-1',
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });

    const updated = await repository.update(saved.id, 'user-1', {
      name: 'Belgian Waffles',
    });

    expect(updated?.name).toBe('Belgian Waffles');
    expect(updated?.type).toBe('food');
  });

  it('update changes updatedAt timestamp', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      userId: 'user-1',
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });
    const originalUpdatedAt = saved.updatedAt;

    await new Promise((r) => setTimeout(r, 10));
    const updated = await repository.update(saved.id, 'user-1', {
      name: 'Waffles',
    });

    expect(updated?.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime(),
    );
    expect(updated?.createdAt).toEqual(saved.createdAt);
  });

  it('update returns null when recipe does not exist', async () => {
    const repository = RecipeRepository.createNull();

    const result = await repository.update('nonexistent-id', 'user-1', {
      name: 'Test',
    });

    expect(result).toBeNull();
  });

  it('update returns null when recipe belongs to different user', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      userId: 'user-1',
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });

    const result = await repository.update(saved.id, 'user-2', {
      name: 'Waffles',
    });

    expect(result).toBeNull();
  });
  it('deleteById removes recipe and returns the deleted recipe', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      userId: 'user-1',
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });

    const deleted = await repository.deleteById(saved.id, 'user-1');

    expect(deleted).toEqual(saved);
    expect(await repository.findById(saved.id, 'user-1')).toBeNull();
  });

  it('deleteById returns null when recipe does not exist', async () => {
    const repository = RecipeRepository.createNull();

    const result = await repository.deleteById('nonexistent-id', 'user-1');

    expect(result).toBeNull();
  });

  it('deleteById returns null when recipe belongs to different user', async () => {
    const repository = RecipeRepository.createNull();
    const saved = await repository.save({
      userId: 'user-1',
      name: 'Pancakes',
      type: 'food',
      ingredients: [],
      instructions: [],
    });

    const result = await repository.deleteById(saved.id, 'user-2');

    expect(result).toBeNull();
    expect(await repository.findById(saved.id, 'user-1')).toEqual(saved);
  });
});
