import {
  PrismaClient,
  GroceryList as PrismaGroceryList,
  GroceryItem as PrismaGroceryItem,
} from '@prisma/client';

export type GroceryItem = PrismaGroceryItem;
export type GroceryList = PrismaGroceryList & { items: GroceryItem[] };
export type GroceryListWithoutItems = PrismaGroceryList;

export interface GroceryListInput {
  userId: string;
  name: string;
}

export interface GroceryItemInput {
  listId: string;
  name: string;
  quantity?: string;
}

export type CreateGroceryListDto = Omit<GroceryListInput, 'userId'>;
export type CreateGroceryItemDto = Omit<GroceryItemInput, 'listId'>;
export type UpdateGroceryItemDto = Partial<
  CreateGroceryItemDto & { checked: boolean }
>;

interface GroceryListStore {
  findAll(userId: string): Promise<GroceryListWithoutItems[]>;
  findById(id: string, userId: string): Promise<GroceryList | null>;
  save(data: GroceryListInput): Promise<GroceryList>;
  update(
    id: string,
    userId: string,
    data: Partial<CreateGroceryListDto>,
  ): Promise<GroceryList | null>;
  deleteById(id: string, userId: string): Promise<GroceryList | null>;
  addItem(
    listId: string,
    userId: string,
    data: CreateGroceryItemDto,
  ): Promise<GroceryItem | null>;
  updateItem(
    listId: string,
    itemId: string,
    userId: string,
    data: UpdateGroceryItemDto,
  ): Promise<GroceryItem | null>;
  deleteItem(
    listId: string,
    itemId: string,
    userId: string,
  ): Promise<GroceryItem | null>;
}

interface NullOptions {
  lists?: GroceryList[];
}

export class GroceryListRepository {
  private constructor(private store: GroceryListStore) {}

  static create(prisma: PrismaClient): GroceryListRepository {
    return new GroceryListRepository(new PrismaGroceryListStore(prisma));
  }

  static createNull(options: NullOptions = {}): GroceryListRepository {
    return new GroceryListRepository(
      new InMemoryGroceryListStore(options.lists ?? []),
    );
  }

  async findAll(userId: string): Promise<GroceryListWithoutItems[]> {
    return this.store.findAll(userId);
  }

  async findById(id: string, userId: string): Promise<GroceryList | null> {
    return this.store.findById(id, userId);
  }

  async save(data: GroceryListInput): Promise<GroceryList> {
    return this.store.save(data);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateGroceryListDto>,
  ): Promise<GroceryList | null> {
    return this.store.update(id, userId, data);
  }

  async deleteById(id: string, userId: string): Promise<GroceryList | null> {
    return this.store.deleteById(id, userId);
  }

  async addItem(
    listId: string,
    userId: string,
    data: CreateGroceryItemDto,
  ): Promise<GroceryItem | null> {
    return this.store.addItem(listId, userId, data);
  }

  async updateItem(
    listId: string,
    itemId: string,
    userId: string,
    data: UpdateGroceryItemDto,
  ): Promise<GroceryItem | null> {
    return this.store.updateItem(listId, itemId, userId, data);
  }

  async deleteItem(
    listId: string,
    itemId: string,
    userId: string,
  ): Promise<GroceryItem | null> {
    return this.store.deleteItem(listId, itemId, userId);
  }
}

class PrismaGroceryListStore implements GroceryListStore {
  constructor(private prisma: PrismaClient) {}

  async findAll(userId: string): Promise<GroceryListWithoutItems[]> {
    return this.prisma.groceryList.findMany({ where: { userId } });
  }

  async findById(id: string, userId: string): Promise<GroceryList | null> {
    return this.prisma.groceryList.findFirst({
      where: { id, userId },
      include: { items: true },
    });
  }

  async save(data: GroceryListInput): Promise<GroceryList> {
    return this.prisma.groceryList.create({
      data,
      include: { items: true },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateGroceryListDto>,
  ): Promise<GroceryList | null> {
    const list = await this.prisma.groceryList.findFirst({
      where: { id, userId },
    });
    if (!list) return null;
    return this.prisma.groceryList.update({
      where: { id },
      data,
      include: { items: true },
    });
  }

  async deleteById(id: string, userId: string): Promise<GroceryList | null> {
    const list = await this.prisma.groceryList.findFirst({
      where: { id, userId },
      include: { items: true },
    });
    if (!list) return null;
    await this.prisma.groceryList.delete({ where: { id } });
    return list;
  }

  async addItem(
    listId: string,
    userId: string,
    data: CreateGroceryItemDto,
  ): Promise<GroceryItem | null> {
    const list = await this.prisma.groceryList.findFirst({
      where: { id: listId, userId },
    });
    if (!list) return null;
    return this.prisma.groceryItem.create({
      data: { ...data, listId },
    });
  }

  async updateItem(
    listId: string,
    itemId: string,
    userId: string,
    data: UpdateGroceryItemDto,
  ): Promise<GroceryItem | null> {
    const list = await this.prisma.groceryList.findFirst({
      where: { id: listId, userId },
    });
    if (!list) return null;
    const item = await this.prisma.groceryItem.findFirst({
      where: { id: itemId, listId },
    });
    if (!item) return null;
    return this.prisma.groceryItem.update({
      where: { id: itemId },
      data,
    });
  }

  async deleteItem(
    listId: string,
    itemId: string,
    userId: string,
  ): Promise<GroceryItem | null> {
    const list = await this.prisma.groceryList.findFirst({
      where: { id: listId, userId },
    });
    if (!list) return null;
    const item = await this.prisma.groceryItem.findFirst({
      where: { id: itemId, listId },
    });
    if (!item) return null;
    return this.prisma.groceryItem.delete({ where: { id: itemId } });
  }
}

class InMemoryGroceryListStore implements GroceryListStore {
  constructor(private lists: GroceryList[] = []) {}

  findAll(userId: string): Promise<GroceryListWithoutItems[]> {
    return Promise.resolve(
      this.lists
        .filter((l) => l.userId === userId)
        .map((list) => ({
          id: list.id,
          userId: list.userId,
          name: list.name,
          createdAt: list.createdAt,
          updatedAt: list.updatedAt,
        })),
    );
  }

  findById(id: string, userId: string): Promise<GroceryList | null> {
    return Promise.resolve(
      this.lists.find((l) => l.id === id && l.userId === userId) ?? null,
    );
  }

  save(data: GroceryListInput): Promise<GroceryList> {
    const now = new Date();
    const list: GroceryList = {
      id: crypto.randomUUID(),
      userId: data.userId,
      name: data.name,
      createdAt: now,
      updatedAt: now,
      items: [],
    };
    this.lists.push(list);
    return Promise.resolve(list);
  }

  update(
    id: string,
    userId: string,
    data: Partial<CreateGroceryListDto>,
  ): Promise<GroceryList | null> {
    const index = this.lists.findIndex(
      (l) => l.id === id && l.userId === userId,
    );
    if (index === -1) return Promise.resolve(null);

    const existing = this.lists[index];
    const updated: GroceryList = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.lists[index] = updated;
    return Promise.resolve(updated);
  }

  deleteById(id: string, userId: string): Promise<GroceryList | null> {
    const index = this.lists.findIndex(
      (l) => l.id === id && l.userId === userId,
    );
    if (index === -1) return Promise.resolve(null);

    const [deleted] = this.lists.splice(index, 1);
    return Promise.resolve(deleted);
  }

  addItem(
    listId: string,
    userId: string,
    data: CreateGroceryItemDto,
  ): Promise<GroceryItem | null> {
    const list = this.lists.find((l) => l.id === listId && l.userId === userId);
    if (!list) return Promise.resolve(null);

    const now = new Date();
    const item: GroceryItem = {
      id: crypto.randomUUID(),
      listId,
      name: data.name,
      quantity: data.quantity ?? null,
      checked: false,
      createdAt: now,
      updatedAt: now,
    };
    list.items.push(item);
    return Promise.resolve(item);
  }

  updateItem(
    listId: string,
    itemId: string,
    userId: string,
    data: UpdateGroceryItemDto,
  ): Promise<GroceryItem | null> {
    const list = this.lists.find((l) => l.id === listId && l.userId === userId);
    if (!list) return Promise.resolve(null);

    const itemIndex = list.items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return Promise.resolve(null);

    const existing = list.items[itemIndex];
    const updated: GroceryItem = {
      ...existing,
      ...data,
      quantity:
        data.quantity !== undefined
          ? (data.quantity ?? null)
          : existing.quantity,
      updatedAt: new Date(),
    };
    list.items[itemIndex] = updated;
    return Promise.resolve(updated);
  }

  deleteItem(
    listId: string,
    itemId: string,
    userId: string,
  ): Promise<GroceryItem | null> {
    const list = this.lists.find((l) => l.id === listId && l.userId === userId);
    if (!list) return Promise.resolve(null);

    const itemIndex = list.items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return Promise.resolve(null);

    const [deleted] = list.items.splice(itemIndex, 1);
    return Promise.resolve(deleted);
  }
}
