import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: RecipesService;

  const mockRecipesService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [{ provide: RecipesService, useValue: mockRecipesService }],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get<RecipesService>(RecipesService);

    vi.clearAllMocks();
  });

  describe('POST /recipes', () => {
    it('creates a recipe', async () => {
      const createDto = {
        name: 'Pancakes',
        type: 'food',
        ingredients: [{ name: 'flour', amount: 2, unit: 'cups' }],
        instructions: ['Mix', 'Cook'],
      };
      const recipe = { id: 'uuid-123', ...createDto, createdAt: new Date(), updatedAt: new Date() };

      mockRecipesService.create.mockResolvedValue(recipe);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(recipe);
    });
  });

  describe('GET /recipes', () => {
    it('returns all recipes', async () => {
      const recipes = [{ id: '1', name: 'Pancakes', type: 'food', ingredients: [], instructions: [], createdAt: new Date(), updatedAt: new Date() }];

      mockRecipesService.findAll.mockResolvedValue(recipes);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(recipes);
    });
  });

  describe('GET /recipes/:id', () => {
    it('returns a recipe by id', async () => {
      const recipe = { id: 'uuid-123', name: 'Pancakes', type: 'food', ingredients: [], instructions: [], createdAt: new Date(), updatedAt: new Date() };

      mockRecipesService.findOne.mockResolvedValue(recipe);

      const result = await controller.findOne('uuid-123');

      expect(service.findOne).toHaveBeenCalledWith('uuid-123');
      expect(result).toEqual(recipe);
    });
  });

  describe('PUT /recipes/:id', () => {
    it('updates a recipe', async () => {
      const updateDto = { name: 'Updated Pancakes' };
      const updated = { id: 'uuid-123', name: 'Updated Pancakes', type: 'food', ingredients: [], instructions: [], createdAt: new Date(), updatedAt: new Date() };

      mockRecipesService.update.mockResolvedValue(updated);

      const result = await controller.update('uuid-123', updateDto);

      expect(service.update).toHaveBeenCalledWith('uuid-123', updateDto);
      expect(result).toEqual(updated);
    });
  });

  describe('DELETE /recipes/:id', () => {
    it('deletes a recipe', async () => {
      const deleted = { id: 'uuid-123', name: 'Pancakes', type: 'food', ingredients: [], instructions: [], createdAt: new Date(), updatedAt: new Date() };

      mockRecipesService.delete.mockResolvedValue(deleted);

      const result = await controller.delete('uuid-123');

      expect(service.delete).toHaveBeenCalledWith('uuid-123');
      expect(result).toEqual(deleted);
    });
  });
});
