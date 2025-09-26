import { Provider } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../core/config/app-config.token';
import { EquipmentRepository } from '../../domain/repositories/equipment.repository';
import { EquipmentHttpRepository } from './equipment-http.repository';
import { EquipmentFakeRepository } from './equipment-fake.repository';

export const provideEquipmentRepository = (): Provider => ({
  provide: EquipmentRepository,

  // Decidimos qué implementación usar en base al useFakeApi del APP_CONFIG
  useFactory: (
    config: AppConfig,
    httpRepo: EquipmentHttpRepository,
    fakeRepo: EquipmentFakeRepository
  ) => {
    return config.useFakeApi ? fakeRepo : httpRepo;
  },

  // Angular inyecta estas dependencias automáticamente
  deps: [APP_CONFIG, EquipmentHttpRepository, EquipmentFakeRepository],
});
