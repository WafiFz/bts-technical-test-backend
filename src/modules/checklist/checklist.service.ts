import { Injectable } from '@nestjs/common';
import PrismaService from '../prisma/prisma.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';

@Injectable()
export class ChecklistService {
  constructor(private prisma: PrismaService) {}

  async getAllChecklists(userId: string) {
    return this.prisma.checklist.findMany({
      where: { userId: userId },
    });
  }

  async createChecklist(
    createChecklistDto: CreateChecklistDto,
    userId: string,
  ) {
    return this.prisma.checklist.create({
      data: {
        ...createChecklistDto,
        userId: userId,
        // user: { connect: { id: userId } }
      },
    });
  }

  async deleteChecklist(checklistId: number, userId: string) {
    return this.prisma.checklist.deleteMany({
      where: {
        id: Number(checklistId),
        userId: userId,
      },
    });
  }
}
