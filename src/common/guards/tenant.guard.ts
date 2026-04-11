import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../enums';

/**
 * Multi-tenant guard: vérifie que l'utilisateur accède uniquement
 * aux données de son organisation (sauf SUPER_ADMIN et ADMIN_MMS).
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Super Admin et Admin MMS ont accès global
    if ([UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS].includes(user?.role)) {
      return true;
    }

    // Pour les autres, l'organisation_id de la requête doit correspondre au sien
    const orgId = request.params?.organisationId || request.body?.organisation_id;
    if (orgId && user?.organisation_id && orgId !== user.organisation_id) {
      throw new ForbiddenException('Accès refusé à cette organisation');
    }

    return true;
  }
}
