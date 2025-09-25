import { Injectable } from '@angular/core';
import { Equipment } from '../../domain/models/equipment.model';
import { EquipmentRepository } from '../../domain/repositories/equipment.repository';

@Injectable({ providedIn: 'root' })
export class EquipmentFakeRepository implements EquipmentRepository {
    
  // Datos de prueba (6 equipos)
  private equipments: Equipment[] = [
    new Equipment(
      '1',
      'ASSET-001',
      'SN-001',
      'Laptop Dell',
      'Laptop',
      'Available',
      'LOC-01',
      new Date('2023-01-10'),
      new Date('2026-01-10'),
      new Map([['ram', '16GB'], ['cpu', 'i7']])
    ),
    new Equipment(
      '2',
      'ASSET-002',
      'SN-002',
      'Impresora HP',
      'Printer',
      'InUse',
      'LOC-02',
      new Date('2022-05-20'),
      new Date('2025-05-20'),
      new Map([['color', 'Sí'], ['dpi', '1200']])
    ),
    new Equipment(
      '3',
      'ASSET-003',
      'SN-003',
      'Monitor Samsung',
      'Monitor',
      'Available',
      'LOC-03',
      new Date('2021-08-15'),
      new Date('2024-08-15'),
      new Map([['resolución', '1080p'], ['tamaño', '27 pulgadas']])
    ),
    new Equipment(
      '4',
      'ASSET-004',
      'SN-004',
      'Teclado Logitech',
      'Accessory',
      'InUse',
      'LOC-04',
      new Date('2023-02-01'),
      new Date('2027-02-01'),
      new Map([['idioma', 'ES'], ['inalámbrico', 'Sí']])
    ),
    new Equipment(
      '5',
      'ASSET-005',
      'SN-005',
      'Mouse Genius',
      'Accessory',
      'Retired',
      'LOC-05',
      new Date('2020-09-01'),
      new Date('2023-09-01'),
      new Map([['dpi', '1600'], ['botones', '3']])
    ),
    new Equipment(
      '6',
      'ASSET-006',
      'SN-006',
      'Servidor Lenovo',
      'Server',
      'Available',
      'LOC-06',
      new Date('2019-03-01'),
      new Date('2029-03-01'),
      new Map([['ram', '64GB'], ['cpu', 'Xeon']])
    )
  ];

  async getAll(): Promise<Equipment[]> {
    return Promise.resolve(this.equipments);
  }

  async getById(id: string): Promise<Equipment | null> {
    const eq = this.equipments.find(e => e.id === id);
    return Promise.resolve(eq ?? null);
  }

  async create(equipment: Equipment): Promise<void> {
    this.equipments.push(equipment);
    return Promise.resolve();
  }

  async update(equipment: Equipment): Promise<void> {
    const index = this.equipments.findIndex(e => e.id === equipment.id);
    if (index !== -1) this.equipments[index] = equipment;
    return Promise.resolve();
  }

  async delete(id: string): Promise<void> {
    this.equipments = this.equipments.filter(e => e.id !== id);
    return Promise.resolve();
  }
}
