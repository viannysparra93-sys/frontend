import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EquipmentRepository } from '../../../../domain/repositories/equipment.repository';

export const equipmentExistsGuard: CanActivateFn = async (route, state) => {
  const repo = inject(EquipmentRepository);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (!id) return router.createUrlTree(['/equipment']);

  try {
   const found = await repo.getById(id);
    return !!found || router.createUrlTree(['/equipment']);
  } catch {
    return router.createUrlTree(['/equipment']);
  }
};
