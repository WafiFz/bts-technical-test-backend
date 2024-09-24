import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import PrismaService from '../prisma/prisma.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Injectable()
export class ChecklistItemService {
  constructor(private prisma: PrismaService) {}

  async getAllChecklistItems(checklistId: number, userId: string) {
    try {
      return await this.prisma.checklistItem.findMany({
        where: {
          checklistId,
          checklist: { userId },
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to retrieve checklist items');
    }
  }

  async createChecklistItem(
    checklistId: number,
    createChecklistItemDto: CreateChecklistItemDto,
    userId: string,
  ) {
    try {
      await this.validateChecklistOwnership(checklistId, userId);
      return await this.prisma.checklistItem.create({
        data: {
          ...createChecklistItemDto,
          checklistId,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create checklist item');
    }
  }

  async getChecklistItem(
    checklistId: number,
    checklistItemId: number,
    userId: string,
  ) {
    try {
      await this.validateChecklistOwnership(checklistId, userId);
      const item = await this.prisma.checklistItem.findFirst({
        where: {
          id: checklistItemId,
          checklistId,
        },
      });
      if (!item) throw new NotFoundException('Checklist item not found');
      return item;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to retrieve checklist item');
    }
  }

  async updateChecklistItemStatus(
    checklistId: number,
    checklistItemId: number,
    userId: string,
  ) {
    try {
      await this.validateChecklistOwnership(checklistId, userId);
      const checklistItem = await this.prisma.checklistItem.findFirst({
        where: { id: checklistItemId, checklistId },
      });
      if (!checklistItem)
        throw new NotFoundException('Checklist item not found');
      return await this.prisma.checklistItem.update({
        where: { id: checklistItemId },
        data: { isChecked: !checklistItem.isChecked },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to update checklist item status');
    }
  }

  async deleteChecklistItem(
    checklistId: number,
    checklistItemId: number,
    userId: string,
  ) {
    try {
      await this.validateChecklistOwnership(checklistId, userId);
      const checklistItem = await this.prisma.checklistItem.findFirst({
        where: { id: checklistItemId, checklistId },
      });
      if (!checklistItem)
        throw new NotFoundException('Checklist item not found');
      return await this.prisma.checklistItem.delete({
        where: { id: checklistItemId },
      });
    } catch (error) {
      return error;
    }
  }

  async renameChecklistItem(
    checklistId: number,
    checklistItemId: number,
    updateChecklistItemDto: UpdateChecklistItemDto,
    userId: string,
  ) {
    try {
      await this.validateChecklistOwnership(checklistId, userId);
      const checklistItem = await this.prisma.checklistItem.findFirst({
        where: { id: checklistItemId, checklistId },
      });
      if (!checklistItem)
        throw new NotFoundException('Checklist item not found');
      return await this.prisma.checklistItem.update({
        where: { id: checklistItemId },
        data: updateChecklistItemDto,
      });
    } catch (error) {
      return error;
    }
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
