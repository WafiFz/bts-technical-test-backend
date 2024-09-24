import { Injectable, NotFoundException } from '@nestjs/common';
import PrismaService from '../prisma/prisma.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Injectable()
export class ChecklistItemService {
  constructor(private prisma: PrismaService) {}

  async getAllChecklistItems(checklistId: number, userId: string) {
    return this.prisma.checklistItem.findMany({
      where: {
        checklistId,
        checklist: { userId },
      },
    });
  }

  async createChecklistItem(
    checklistId: number,
    createChecklistItemDto: CreateChecklistItemDto,
    userId: string,
  ) {
    await this.validateChecklistOwnership(checklistId, userId);
    return this.prisma.checklistItem.create({
      data: {
        ...createChecklistItemDto,
        checklistId,
      },
    });
  }

  async getChecklistItem(
    checklistId: number,
    checklistItemId: number,
    userId: string,
  ) {
    await this.validateChecklistOwnership(checklistId, userId);
    return this.prisma.checklistItem.findFirst({
      where: {
        id: checklistItemId,
        checklistId,
      },
    });
  }

  async updateChecklistItemStatus(
    checklistId: number,
    checklistItemId: number,
    userId: string,
  ) {
    await this.validateChecklistOwnership(checklistId, userId);
    const checklistItem = await this.prisma.checklistItem.findFirst({
      where: { id: checklistItemId, checklistId },
    });
    if (!checklistItem) throw new NotFoundException('Checklist item not found');
    return this.prisma.checklistItem.update({
      where: { id: checklistItemId },
      data: { isChecked: !checklistItem.isChecked },
    });
  }

  async deleteChecklistItem(
    checklistId: number,
    checklistItemId: number,
    userId: string,
  ) {
    await this.validateChecklistOwnership(checklistId, userId);
    return this.prisma.checklistItem.delete({
      where: { id: checklistItemId },
    });
  }

  async renameChecklistItem(
    checklistId: number,
    checklistItemId: number,
    updateChecklistItemDto: UpdateChecklistItemDto,
    userId: string,
  ) {
    await this.validateChecklistOwnership(checklistId, userId);
    return this.prisma.checklistItem.update({
      where: { id: checklistItemId },
      data: updateChecklistItemDto,
    });
  }

  private async validateChecklistOwnership(
    checklistId: number,
    userId: string,
  ) {
    const checklist = await this.prisma.checklist.findFirst({
      where: { id: checklistId, userId },
    });
    if (!checklist) throw new NotFoundException('Checklist not found');
  }
}
