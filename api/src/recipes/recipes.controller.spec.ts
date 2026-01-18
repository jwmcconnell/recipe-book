import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../auth/auth.service';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipeRepository } from './recipe-repository';

describe('RecipesController', () => {
  let controller: RecipesController;
  let repository: RecipeRepository;

  beforeEach(async () => {
    repository = RecipeRepository.createNull();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        RecipesService,
        { provide: RecipeRepository, useValue: repository },
        { provide: AuthService, useValue: AuthService.createNull() },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
  });

  describe('POST /recipes', () => {
    it('creates a recipe and returns it with id', async () => {
      const createDto = {
        name: 'Pancakes',
        type: 'food',
        ingredients: [{ name: 'flour', amount: 2, unit: 'cups' }],
        instructions: ['Mix', 'Cook'],
      };

      const result = await controller.create(createDto);

      expect(result.id).toBeDefined();
      expect(result.name).toBe('Pancakes');
      expect(result.type).toBe('food');
      expect(result.ingredients).toEqual([
        { name: 'flour', amount: 2, unit: 'cups' },
      ]);
    });

    it('persists the created recipe', async () => {
      const createDto = {
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      };

      const created = await controller.create(createDto);
      const found = await controller.findOne(created.id);

      expect(found).toEqual(created);
    });
  });

  describe('GET /recipes', () => {
    it('returns empty array when no recipes exist', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('returns all created recipes', async () => {
      await controller.create({
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });
      await controller.create({
        name: 'Margarita',
        type: 'drink',
        ingredients: [],
        instructions: [],
      });

      const result = await controller.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Pancakes');
      expect(result[1].name).toBe('Margarita');
    });
  });

  describe('GET /recipes/:id', () => {
    it('returns a recipe by id', async () => {
      const created = await controller.create({
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });

      const result = await controller.findOne(created.id);

      expect(result?.name).toBe('Pancakes');
    });

    it('returns null when recipe does not exist', async () => {
      const result = await controller.findOne('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('PUT /recipes/:id', () => {
    it('updates a recipe and returns the updated version', async () => {
      const created = await controller.create({
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });

      const result = await controller.update(created.id, {
        name: 'Belgian Waffles',
      });

      expect(result?.name).toBe('Belgian Waffles');
      expect(result?.type).toBe('food');
    });

    it('persists the update', async () => {
      const created = await controller.create({
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });
      await controller.update(created.id, { name: 'Waffles' });

      const found = await controller.findOne(created.id);

      expect(found?.name).toBe('Waffles');
    });

    it('returns null when recipe does not exist', async () => {
      const result = await controller.update('nonexistent-id', {
        name: 'Test',
      });

      expect(result).toBeNull();
    });
  });

  describe('DELETE /recipes/:id', () => {
    it('deletes a recipe and returns it', async () => {
      const created = await controller.create({
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });

      const result = await controller.delete(created.id);

      expect(result?.name).toBe('Pancakes');
    });

    it('recipe is no longer found after deletion', async () => {
      const created = await controller.create({
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });
      await controller.delete(created.id);

      const found = await controller.findOne(created.id);

      expect(found).toBeNull();
    });

    it('returns null when recipe does not exist', async () => {
      const result = await controller.delete('nonexistent-id');

      expect(result).toBeNull();
    });
  });
});
