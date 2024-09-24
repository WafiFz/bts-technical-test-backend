import { Module } from '@nestjs/common';
import { ChecklistItemController } from './checklist-item.controller';
import { ChecklistItemService } from './checklist-item.service';
import PrismaModule from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChecklistItemController],
  providers: [ChecklistItemService],
})
export class ChecklistItemModule {}
