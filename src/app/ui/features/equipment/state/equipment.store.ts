import { Injectable, signal, inject } from '@angular/core';
import { Equipment } from '../../../../domain/models/equipment.model';
import { EquipmentRepository } from '../../../../domain/repositories/equipment.repository';

@Injectable({ providedIn: 'root' })
export class EquipmentStore {
  private readonly repo = inject(EquipmentRepository);

  // Signals
  readonly equipments = signal<Equipment[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  async loadEquipments() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.repo.getAll();
      this.equipments.set(data);
    } catch (err: any) {
      this.error.set(err.message ?? 'Error cargando equipos');
    } finally {
      this.loading.set(false);
    }
  }
}
