import { RolesEnum } from '@/decorators/roles.decorator';

export interface CtxUser {
  sub: string;
  email: string;
  roles: RolesEnum[];
}
