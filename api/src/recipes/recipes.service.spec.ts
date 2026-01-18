import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecipesService } from './recipes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RecipesService', () => {
  let service: RecipesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    recipe: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    prisma = module.get<PrismaService>(PrismaService);

    vi.clearAllMocks();
  });

  describe('create', () => {
    it('creates a recipe with given data', async () => {
      const recipeData = {
        name: 'Pancakes',
        type: 'food',
        ingredients: [{ name: 'flour', amount: 2, unit: 'cups' }],
        instructions: ['Mix ingredients', 'Cook on griddle'],
      };

      const expectedRecipe = {
        id: 'uuid-123',
        ...recipeData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.recipe.create.mockResolvedValue(expectedRecipe);

      const result = await service.create(recipeData);

      expect(prisma.recipe.create).toHaveBeenCalledWith({ data: recipeData });
      expect(result).toEqual(expectedRecipe);
    });
  });

  describe('findAll', () => {
    it('returns all recipes', async () => {
      const recipes = [
        { id: '1', name: 'Pancakes', type: 'food', ingredients: [], instructions: [], createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Margarita', type: 'drink', ingredients: [], instructions: [], createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrismaService.recipe.findMany.mockResolvedValue(recipes);

      const result = await service.findAll();

      expect(prisma.recipe.findMany).toHaveBeenCalled();
      expect(result).toEqual(recipes);
    });
  });

  describe('findOne', () => {
    it('returns a recipe by id', async () => {
      const recipe = { id: 'uuid-123', name: 'Pancakes', type: 'food', ingredients: [], instructions: [], createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.recipe.findUnique.mockResolvedValue(recipe);

      const result = await service.findOne('uuid-123');

      expect(prisma.recipe.findUnique).toHaveBeenCalledWith({ where: { id: 'uuid-123' } });
      expect(result).toEqual(recipe);
    });
  });

  describe('update', () => {
    it('updates a recipe', async () => {
      const updateData = { name: 'Updated Pancakes' };
      const updatedRecipe = { id: 'uuid-123', name: 'Updated Pancakes', type: 'food', ingredients: [], instructions: [], createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.recipe.update.mockResolvedValue(updatedRecipe);

      const result = await service.update('uuid-123', updateData);

      expect(prisma.recipe.update).toHaveBeenCalledWith({ where: { id: 'uuid-123' }, data: updateData });
      expect(result).toEqual(updatedRecipe);
    });
  });

  describe('delete', () => {
    it('deletes a recipe', async () => {
      const deletedRecipe = { id: 'uuid-123', name: 'Pancakes', type: 'food', ingredients: [], instructions: [], createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.recipe.delete.mockResolvedValue(deletedRecipe);

      const result = await service.delete('uuid-123');

      expect(prisma.recipe.delete).toHaveBeenCalledWith({ where: { id: 'uuid-123' } });
      expect(result).toEqual(deletedRecipe);
    });
  });
});
