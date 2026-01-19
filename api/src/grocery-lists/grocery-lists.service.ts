import { Injectable } from '@nestjs/common';
import {
  GroceryListRepository,
  GroceryList,
  GroceryListWithoutItems,
  GroceryListInput,
  CreateGroceryListDto,
  GroceryItem,
  CreateGroceryItemDto,
  UpdateGroceryItemDto,
} from './grocery-list-repository';

@Injectable()
export class GroceryListsService {
  constructor(private repository: GroceryListRepository) {}

  create(data: GroceryListInput): Promise<GroceryList> {
    return this.repository.save(data);
  }

  findAll(userId: string): Promise<GroceryListWithoutItems[]> {
    return this.repository.findAll(userId);
  }

  findOne(id: string, userId: string): Promise<GroceryList | null> {
    return this.repository.findById(id, userId);
  }

  update(
    id: string,
    userId: string,
    data: Partial<CreateGroceryListDto>,
  ): Promise<GroceryList | null> {
    return this.repository.update(id, userId, data);
  }

  delete(id: string, userId: string): Promise<GroceryList | null> {
    return this.repository.deleteById(id, userId);
  }

  addItem(
    listId: string,
    userId: string,
    data: CreateGroceryItemDto,
  ): Promise<GroceryItem | null> {
    return this.repository.addItem(listId, userId, data);
  }

  updateItem(
    listId: string,
    itemId: string,
    userId: string,
    data: UpdateGroceryItemDto,
  ): Promise<GroceryItem | null> {
    return this.repository.updateItem(listId, itemId, userId, data);
  }

  deleteItem(
    listId: string,
    itemId: string,
    userId: string,
  ): Promise<GroceryItem | null> {
    return this.repository.deleteItem(listId, itemId, userId);
  }
}
