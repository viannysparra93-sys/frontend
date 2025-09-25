// frontend/src/app/infrastructure/equipment/index.ts
import { Provider, inject } from '@angular/core';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { EquipmentRepository } from '../../domain/repositories/equipment.repository';
import { EquipmentHttpRepository } from './equipment-http.repository';
import { EquipmentFakeRepository } from './equipment-fake.repository';

export const provideEquipmentRepository = (): Provider => ({
  provide: EquipmentRepository,
  useFactory: () => {
    const cfg = inject(APP_CONFIG);
    return cfg.useFakeApi
      ? inject(EquipmentFakeRepository)
      : inject(EquipmentHttpRepository);
  },
  deps: [APP_CONFIG, EquipmentHttpRepository, EquipmentFakeRepository],
});
