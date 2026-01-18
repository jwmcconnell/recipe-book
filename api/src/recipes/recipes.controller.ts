import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.service';
import { RecipesService } from './recipes.service';
import type { CreateRecipeDto } from './recipe-repository';

@Controller('recipes')
@UseGuards(AuthGuard)
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Post()
  create(
    @Req() req: Request & { user: AuthUser },
    @Body() data: CreateRecipeDto,
  ) {
    return this.recipesService.create({ ...data, userId: req.user.userId });
  }

  @Get()
  findAll(@Req() req: Request & { user: AuthUser }) {
    return this.recipesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(
    @Req() req: Request & { user: AuthUser },
    @Param('id') id: string,
  ) {
    return this.recipesService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Req() req: Request & { user: AuthUser },
    @Param('id') id: string,
    @Body() data: Partial<CreateRecipeDto>,
  ) {
    return this.recipesService.update(id, req.user.userId, data);
  }

  @Delete(':id')
  delete(@Req() req: Request & { user: AuthUser }, @Param('id') id: string) {
    return this.recipesService.delete(id, req.user.userId);
  }
}
