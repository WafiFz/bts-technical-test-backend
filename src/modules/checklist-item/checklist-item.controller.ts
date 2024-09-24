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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChecklistItemService } from './checklist-item.service';
import Auth from '@/decorators/auth.decorator';
import { GetUser } from '@/decorators/get-user.decorator';
import { CtxUser } from '@/interfaces/ctx-user.interface';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@ApiTags('Checklist Items')
@Controller('checklist/:checklistId/item')
@ApiBearerAuth()
export class ChecklistItemController {
  constructor(private readonly checklistItemService: ChecklistItemService) {}

  @Get()
  @Auth()
  async getAllChecklistItems(
    @Param('checklistId') checklistId: number,
    @GetUser() ctxUser: CtxUser,
  ) {
    return this.checklistItemService.getAllChecklistItems(
      Number(checklistId),
      ctxUser.sub,
    );
  }

  @Post()
  @Auth()
  async createChecklistItem(
    @Param('checklistId') checklistId: number,
    @Body() createChecklistItemDto: CreateChecklistItemDto,
    @GetUser() ctxUser: CtxUser,
  ) {
    return this.checklistItemService.createChecklistItem(
      Number(checklistId),
      createChecklistItemDto,
      ctxUser.sub,
    );
  }

  @Get(':checklistItemId')
  @Auth()
  async getChecklistItem(
    @Param('checklistId') checklistId: number,
    @Param('checklistItemId') checklistItemId: number,
    @GetUser() ctxUser: CtxUser,
  ) {
    return this.checklistItemService.getChecklistItem(
      Number(checklistId),
      Number(checklistItemId),
      ctxUser.sub,
    );
  }

  @Put(':checklistItemId')
  @Auth()
  async updateChecklistItemStatus(
    @Param('checklistId') checklistId: number,
    @Param('checklistItemId') checklistItemId: number,
    @GetUser() ctxUser: CtxUser,
  ) {
    return this.checklistItemService.updateChecklistItemStatus(
      Number(checklistId),
      Number(checklistItemId),
      ctxUser.sub,
    );
  }

  @Delete(':checklistItemId')
  @Auth()
  async deleteChecklistItem(
    @Param('checklistId') checklistId: number,
    @Param('checklistItemId') checklistItemId: number,
    @GetUser() ctxUser: CtxUser,
  ) {
    return this.checklistItemService.deleteChecklistItem(
      Number(checklistId),
      Number(checklistItemId),
      ctxUser.sub,
    );
  }

  @Put('rename/:checklistItemId')
  @Auth()
  async renameChecklistItem(
    @Param('checklistId') checklistId: number,
    @Param('checklistItemId') checklistItemId: number,
    @Body() updateChecklistItemDto: UpdateChecklistItemDto,
    @GetUser() ctxUser: CtxUser,
  ) {
    return this.checklistItemService.renameChecklistItem(
      Number(checklistId),
      Number(checklistItemId),
      updateChecklistItemDto,
      ctxUser.sub,
    );
  }
}
