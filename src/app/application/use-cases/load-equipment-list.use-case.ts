import { Injectable } from '@angular/core';
import { Equipment } from '../../domain/models/equipment.model';
import { EquipmentRepository } from '../../domain/repositories/equipment.repository';

@Injectable({
  providedIn: 'root'
})
export class LoadEquipmentListUseCase {
  constructor(private repository: EquipmentRepository) {}

  // Ejecuta la lógica: obtener todos los equipos del repositorio
  async execute(): Promise<Equipment[]> {
    // 👇 usamos findAll(), que devuelve un array de equipos
    return await this.repository.findAll();
  }
}
