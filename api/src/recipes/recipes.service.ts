import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Recipe } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.RecipeCreateInput): Promise<Recipe> {
    return this.prisma.recipe.create({ data });
  }

  findAll(): Promise<Recipe[]> {
    return this.prisma.recipe.findMany();
  }

  findOne(id: string): Promise<Recipe | null> {
    return this.prisma.recipe.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.RecipeUpdateInput): Promise<Recipe> {
    return this.prisma.recipe.update({ where: { id }, data });
  }

  delete(id: string): Promise<Recipe> {
    return this.prisma.recipe.delete({ where: { id } });
  }
}
