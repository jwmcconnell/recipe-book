import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Request } from 'express';
import { AuthService, AuthUser } from '../auth/auth.service';
import { GroceryListsController } from './grocery-lists.controller';
import { GroceryListsService } from './grocery-lists.service';
import { GroceryListRepository } from './grocery-list-repository';

function mockRequest(userId: string): Request & { user: AuthUser } {
  return { user: { userId } } as Request & { user: AuthUser };
}

describe('GroceryListsController', () => {
  let controller: GroceryListsController;
  let repository: GroceryListRepository;
  const testUserId = 'test-user-123';

  beforeEach(async () => {
    repository = GroceryListRepository.createNull();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroceryListsController],
      providers: [
        GroceryListsService,
        { provide: GroceryListRepository, useValue: repository },
        { provide: AuthService, useValue: AuthService.createNull() },
      ],
    }).compile();

    controller = module.get<GroceryListsController>(GroceryListsController);
  });

  describe('POST /grocery-lists', () => {
    it('creates a grocery list and returns it with id', async () => {
      const createDto = { name: 'Weekly Shopping' };

      const result = await controller.create(
        mockRequest(testUserId),
        createDto,
      );

      expect(result.id).toBeDefined();
      expect(result.userId).toBe(testUserId);
      expect(result.name).toBe('Weekly Shopping');
      expect(result.items).toEqual([]);
    });

    it('persists the created list', async () => {
      const createDto = { name: 'Weekly Shopping' };

      const created = await controller.create(
        mockRequest(testUserId),
        createDto,
      );
      const found = await controller.findOne(
        mockRequest(testUserId),
        created.id,
      );

      expect(found).toEqual(created);
    });
  });

  describe('GET /grocery-lists', () => {
    it('returns empty array when no lists exist', async () => {
      const result = await controller.findAll(mockRequest(testUserId));

      expect(result).toEqual([]);
    });

    it('returns all created lists', async () => {
      await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });
      await controller.create(mockRequest(testUserId), {
        name: 'Party Supplies',
      });

      const result = await controller.findAll(mockRequest(testUserId));

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Weekly Shopping');
      expect(result[1].name).toBe('Party Supplies');
    });
  });

  describe('GET /grocery-lists/:id', () => {
    it('returns a list by id with its items', async () => {
      const created = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });

      const result = await controller.findOne(
        mockRequest(testUserId),
        created.id,
      );

      expect(result?.name).toBe('Weekly Shopping');
      expect(result?.items).toEqual([]);
    });

    it('returns null when list does not exist', async () => {
      const result = await controller.findOne(
        mockRequest(testUserId),
        'nonexistent-id',
      );

      expect(result).toBeNull();
    });
  });

  describe('PUT /grocery-lists/:id', () => {
    it('updates a list and returns the updated version', async () => {
      const created = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });

      const result = await controller.update(
        mockRequest(testUserId),
        created.id,
        {
          name: 'Monthly Shopping',
        },
      );

      expect(result?.name).toBe('Monthly Shopping');
    });

    it('persists the update', async () => {
      const created = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });
      await controller.update(mockRequest(testUserId), created.id, {
        name: 'Monthly Shopping',
      });

      const found = await controller.findOne(
        mockRequest(testUserId),
        created.id,
      );

      expect(found?.name).toBe('Monthly Shopping');
    });

    it('returns null when list does not exist', async () => {
      const result = await controller.update(
        mockRequest(testUserId),
        'nonexistent-id',
        {
          name: 'Test',
        },
      );

      expect(result).toBeNull();
    });
  });

  describe('DELETE /grocery-lists/:id', () => {
    it('deletes a list and returns it', async () => {
      const created = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });

      const result = await controller.delete(
        mockRequest(testUserId),
        created.id,
      );

      expect(result?.name).toBe('Weekly Shopping');
    });

    it('list is no longer found after deletion', async () => {
      const created = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });
      await controller.delete(mockRequest(testUserId), created.id);

      const found = await controller.findOne(
        mockRequest(testUserId),
        created.id,
      );

      expect(found).toBeNull();
    });

    it('returns null when list does not exist', async () => {
      const result = await controller.delete(
        mockRequest(testUserId),
        'nonexistent-id',
      );

      expect(result).toBeNull();
    });
  });

  describe('POST /grocery-lists/:listId/items', () => {
    it('adds an item to a list and returns it', async () => {
      const list = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });

      const item = await controller.addItem(mockRequest(testUserId), list.id, {
        name: 'Milk',
        quantity: '1 gallon',
      });

      expect(item?.id).toBeDefined();
      expect(item?.name).toBe('Milk');
      expect(item?.quantity).toBe('1 gallon');
      expect(item?.checked).toBe(false);
    });

    it('item appears in the list', async () => {
      const list = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });
      await controller.addItem(mockRequest(testUserId), list.id, {
        name: 'Milk',
      });

      const found = await controller.findOne(mockRequest(testUserId), list.id);

      expect(found?.items).toHaveLength(1);
      expect(found?.items[0].name).toBe('Milk');
    });

    it('returns null when list does not exist', async () => {
      const result = await controller.addItem(
        mockRequest(testUserId),
        'nonexistent-id',
        {
          name: 'Milk',
        },
      );

      expect(result).toBeNull();
    });
  });

  describe('PUT /grocery-lists/:listId/items/:id', () => {
    it('updates an item and returns it', async () => {
      const list = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });
      const item = await controller.addItem(mockRequest(testUserId), list.id, {
        name: 'Milk',
      });

      const updated = await controller.updateItem(
        mockRequest(testUserId),
        list.id,
        item!.id,
        { checked: true },
      );

      expect(updated?.checked).toBe(true);
    });

    it('can update name and quantity', async () => {
      const list = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });
      const item = await controller.addItem(mockRequest(testUserId), list.id, {
        name: 'Milk',
      });

      const updated = await controller.updateItem(
        mockRequest(testUserId),
        list.id,
        item!.id,
        { name: 'Whole Milk', quantity: '2 gallons' },
      );

      expect(updated?.name).toBe('Whole Milk');
      expect(updated?.quantity).toBe('2 gallons');
    });

    it('returns null when list does not exist', async () => {
      const result = await controller.updateItem(
        mockRequest(testUserId),
        'nonexistent-list',
        'some-item',
        { checked: true },
      );

      expect(result).toBeNull();
    });

    it('returns null when item does not exist', async () => {
      const list = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });

      const result = await controller.updateItem(
        mockRequest(testUserId),
        list.id,
        'nonexistent-item',
        { checked: true },
      );

      expect(result).toBeNull();
    });
  });

  describe('DELETE /grocery-lists/:listId/items/:id', () => {
    it('deletes an item and returns it', async () => {
      const list = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });
      const item = await controller.addItem(mockRequest(testUserId), list.id, {
        name: 'Milk',
      });

      const deleted = await controller.deleteItem(
        mockRequest(testUserId),
        list.id,
        item!.id,
      );

      expect(deleted?.name).toBe('Milk');
    });

    it('item is no longer in the list after deletion', async () => {
      const list = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });
      const item = await controller.addItem(mockRequest(testUserId), list.id, {
        name: 'Milk',
      });
      await controller.deleteItem(mockRequest(testUserId), list.id, item!.id);

      const found = await controller.findOne(mockRequest(testUserId), list.id);

      expect(found?.items).toEqual([]);
    });

    it('returns null when list does not exist', async () => {
      const result = await controller.deleteItem(
        mockRequest(testUserId),
        'nonexistent-list',
        'some-item',
      );

      expect(result).toBeNull();
    });

    it('returns null when item does not exist', async () => {
      const list = await controller.create(mockRequest(testUserId), {
        name: 'Weekly Shopping',
      });

      const result = await controller.deleteItem(
        mockRequest(testUserId),
        list.id,
        'nonexistent-item',
      );

      expect(result).toBeNull();
    });
  });
});
