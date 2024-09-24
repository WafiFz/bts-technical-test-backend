import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { RedisModuleAsyncOptions } from '@liaoliaots/nestjs-redis/dist/redis/interfaces';
import { SharedModule } from '@/shared/shared.module';
import UserModule from '@/modules/user/user.module';
import AuthModule from '@/modules/auth/auth.module';
import PrismaModule from '@/modules/prisma/prisma.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { ChecklistItemModule } from './modules/checklist-item/checklist-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    PrismaModule,
    ChecklistModule,
    ChecklistItemModule,
  ],
})
export default class AppModule {}
