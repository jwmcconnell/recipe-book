import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipeRepository } from './recipe-repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RecipesController],
  providers: [
    RecipesService,
    {
      provide: RecipeRepository,
      useFactory: (prisma: PrismaService) => RecipeRepository.create(prisma),
      inject: [PrismaService],
    },
  ],
})
export class RecipesModule {}
