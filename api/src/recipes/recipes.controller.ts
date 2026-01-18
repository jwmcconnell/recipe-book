import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RecipesService } from './recipes.service';
import type { RecipeInput } from './recipe-repository';

@Controller('recipes')
@UseGuards(AuthGuard)
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Post()
  create(@Body() data: RecipeInput) {
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
  update(@Param('id') id: string, @Body() data: Partial<RecipeInput>) {
    return this.recipesService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.recipesService.delete(id);
  }
}
