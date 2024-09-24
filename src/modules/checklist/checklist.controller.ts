import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { CtxUser } from '@/interfaces/ctx-user.interface';
import Auth from '@/decorators/auth.decorator';
import { GetUser } from '@/decorators/get-user.decorator';

@ApiTags('Checklist')
@Controller('checklist')
@ApiBearerAuth()
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get()
  @Auth()
  async getAllChecklists(@GetUser() ctxUser: CtxUser) {
    const userId = ctxUser.sub;
    return this.checklistService.getAllChecklists(userId);
  }

  @Post()
  @Auth()
  async createChecklist(
    @Body() createChecklistDto: CreateChecklistDto,
    @GetUser() ctxUser: CtxUser,
  ) {
    const userId = ctxUser.sub;
    console.log(createChecklistDto);
    console.log(ctxUser);
    return this.checklistService.createChecklist(createChecklistDto, userId);
  }

  @Delete(':checklistId')
  @Auth()
  async deleteChecklist(
    @Param('checklistId') checklistId: number,
    @GetUser() ctxUser: CtxUser,
  ) {
    const userId = ctxUser.sub;
    const deletedCount = (
      await this.checklistService.deleteChecklist(checklistId, userId)
    ).count;
    return `Deleted ${deletedCount} checklist`;
  }
}
