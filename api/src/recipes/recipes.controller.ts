import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Prisma } from '@prisma/client';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Post()
  create(@Body() data: Prisma.RecipeCreateInput) {
    return this.recipesService.create(data);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.RecipeUpdateInput) {
    return this.recipesService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.recipesService.delete(id);
  }
}
