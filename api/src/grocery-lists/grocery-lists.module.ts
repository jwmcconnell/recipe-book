import { Module } from '@nestjs/common';
import { GroceryListsController } from './grocery-lists.controller';
import { GroceryListsService } from './grocery-lists.service';
import { GroceryListRepository } from './grocery-list-repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GroceryListsController],
  providers: [
    GroceryListsService,
    {
      provide: GroceryListRepository,
      useFactory: (prisma: PrismaService) =>
        GroceryListRepository.create(prisma),
      inject: [PrismaService],
    },
  ],
})
export class GroceryListsModule {}
