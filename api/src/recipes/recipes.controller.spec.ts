import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Request } from 'express';
import { AuthService, AuthUser } from '../auth/auth.service';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipeRepository } from './recipe-repository';

function mockRequest(userId: string): Request & { user: AuthUser } {
  return { user: { userId } } as Request & { user: AuthUser };
}

describe('RecipesController', () => {
  let controller: RecipesController;
  let repository: RecipeRepository;
  const testUserId = 'test-user-123';

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

      const result = await controller.create(mockRequest(testUserId), createDto);

      expect(result.id).toBeDefined();
      expect(result.userId).toBe(testUserId);
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

      const created = await controller.create(mockRequest(testUserId), createDto);
      const found = await controller.findOne(mockRequest(testUserId), created.id);

      expect(found).toEqual(created);
    });
  });

  describe('GET /recipes', () => {
    it('returns empty array when no recipes exist', async () => {
      const result = await controller.findAll(mockRequest(testUserId));

      expect(result).toEqual([]);
    });

    it('returns all created recipes', async () => {
      await controller.create(mockRequest(testUserId), {
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });
      await controller.create(mockRequest(testUserId), {
        name: 'Margarita',
        type: 'drink',
        ingredients: [],
        instructions: [],
      });

      const result = await controller.findAll(mockRequest(testUserId));

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Pancakes');
      expect(result[1].name).toBe('Margarita');
    });
  });

  describe('GET /recipes/:id', () => {
    it('returns a recipe by id', async () => {
      const created = await controller.create(mockRequest(testUserId), {
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });

      const result = await controller.findOne(
        mockRequest(testUserId),
        created.id,
      );

      expect(result?.name).toBe('Pancakes');
    });

    it('returns null when recipe does not exist', async () => {
      const result = await controller.findOne(
        mockRequest(testUserId),
        'nonexistent-id',
      );

      expect(result).toBeNull();
    });
  });

  describe('PUT /recipes/:id', () => {
    it('updates a recipe and returns the updated version', async () => {
      const created = await controller.create(mockRequest(testUserId), {
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });

      const result = await controller.update(
        mockRequest(testUserId),
        created.id,
        { name: 'Belgian Waffles' },
      );

      expect(result?.name).toBe('Belgian Waffles');
      expect(result?.type).toBe('food');
    });

    it('persists the update', async () => {
      const created = await controller.create(mockRequest(testUserId), {
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });
      await controller.update(mockRequest(testUserId), created.id, {
        name: 'Waffles',
      });

      const found = await controller.findOne(
        mockRequest(testUserId),
        created.id,
      );

      expect(found?.name).toBe('Waffles');
    });

    it('returns null when recipe does not exist', async () => {
      const result = await controller.update(
        mockRequest(testUserId),
        'nonexistent-id',
        { name: 'Test' },
      );

      expect(result).toBeNull();
    });
  });

  describe('DELETE /recipes/:id', () => {
    it('deletes a recipe and returns it', async () => {
      const created = await controller.create(mockRequest(testUserId), {
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });

      const result = await controller.delete(
        mockRequest(testUserId),
        created.id,
      );

      expect(result?.name).toBe('Pancakes');
    });

    it('recipe is no longer found after deletion', async () => {
      const created = await controller.create(mockRequest(testUserId), {
        name: 'Pancakes',
        type: 'food',
        ingredients: [],
        instructions: [],
      });
      await controller.delete(mockRequest(testUserId), created.id);

      const found = await controller.findOne(
        mockRequest(testUserId),
        created.id,
      );

      expect(found).toBeNull();
    });

    it('returns null when recipe does not exist', async () => {
      const result = await controller.delete(
        mockRequest(testUserId),
        'nonexistent-id',
      );

      expect(result).toBeNull();
    });
  });
});
