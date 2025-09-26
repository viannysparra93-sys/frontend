import { Provider, inject } from '@angular/core';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { EquipmentRepository } from '../../domain/repositories/equipment.repository';
import { EquipmentHttpRepository } from './equipment-http.repository';
import { EquipmentFakeRepository } from './equipment-fake.repository';

export const provideEquipmentRepository = (): Provider => ({
  provide: EquipmentRepository,

  // decide que clase inyectar segun useFakeApi
  useFactory: () => {
    const cfg = inject(APP_CONFIG);
    return cfg.useFakeApi
      ? inject(EquipmentFakeRepository)//true si usa EquipmentFakeRepository 
      : inject(EquipmentHttpRepository);//false si usa EquipmentHttpRepository
  },

  //dependencias necesarias para que angular pueda inyectarlas 
  deps: [APP_CONFIG, EquipmentHttpRepository, EquipmentFakeRepository],
});
