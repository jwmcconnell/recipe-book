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
import { GroceryListsService } from './grocery-lists.service';
import type {
  CreateGroceryListDto,
  CreateGroceryItemDto,
  UpdateGroceryItemDto,
} from './grocery-list-repository';

@Controller('grocery-lists')
@UseGuards(AuthGuard)
export class GroceryListsController {
  constructor(private groceryListsService: GroceryListsService) {}

  @Post()
  create(
    @Req() req: Request & { user: AuthUser },
    @Body() data: CreateGroceryListDto,
  ) {
    return this.groceryListsService.create({
      ...data,
      userId: req.user.userId,
    });
  }

  @Get()
  findAll(@Req() req: Request & { user: AuthUser }) {
    return this.groceryListsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: Request & { user: AuthUser }, @Param('id') id: string) {
    return this.groceryListsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Req() req: Request & { user: AuthUser },
    @Param('id') id: string,
    @Body() data: Partial<CreateGroceryListDto>,
  ) {
    return this.groceryListsService.update(id, req.user.userId, data);
  }

  @Delete(':id')
  delete(@Req() req: Request & { user: AuthUser }, @Param('id') id: string) {
    return this.groceryListsService.delete(id, req.user.userId);
  }

  @Post(':listId/items')
  addItem(
    @Req() req: Request & { user: AuthUser },
    @Param('listId') listId: string,
    @Body() data: CreateGroceryItemDto,
  ) {
    return this.groceryListsService.addItem(listId, req.user.userId, data);
  }

  @Put(':listId/items/:id')
  updateItem(
    @Req() req: Request & { user: AuthUser },
    @Param('listId') listId: string,
    @Param('id') id: string,
    @Body() data: UpdateGroceryItemDto,
  ) {
    return this.groceryListsService.updateItem(
      listId,
      id,
      req.user.userId,
      data,
    );
  }

  @Delete(':listId/items/:id')
  deleteItem(
    @Req() req: Request & { user: AuthUser },
    @Param('listId') listId: string,
    @Param('id') id: string,
  ) {
    return this.groceryListsService.deleteItem(listId, id, req.user.userId);
  }
}
