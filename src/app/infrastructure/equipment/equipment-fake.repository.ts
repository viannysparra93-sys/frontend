// Repositorio falso (fake repository) que simula operaciones CRUD
// sobre una lista de equipos guardados en memoria.
// Se utiliza para pruebas sin necesidad de un backend real.

import { Injectable } from '@angular/core';
import { Equipment } from '../../domain/models/equipment.model';
import { EquipmentRepository } from '../../domain/repositories/equipment.repository';

@Injectable({ providedIn: 'root' })
export class EquipmentFakeRepository implements EquipmentRepository {

  /**
   * Lista de equipos almacenados en memoria.
   * Actúa como una "base de datos temporal".
   */
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

  

  
   //Retorna todos los equipos registrados.
   
  async findAll(): Promise<Equipment[]> {
    // Retornamos una copia para evitar modificaciones directas al arreglo.
    return [...this.equipments];
  }

  // Buscar por ID: devolver la instancia original (no un objeto plano)
  async findById(id: string): Promise<Equipment | null> {
    const eq = this.equipments.find(e => e.id === id) ?? null;
    return eq ?? null; // devuelve la instancia Equipment o null
  }
  /**
   * Crea un nuevo equipo y lo agrega al listado.
   */
  async create(equipment: Equipment): Promise<Equipment> {
    this.equipments.push(equipment);
    return equipment;
  }

  /**
   * Actualiza un equipo existente en el arreglo.
   * Si el equipo no existe, no hace nada.
   */
  async update(equipment: Equipment): Promise<Equipment> {
    const index = this.equipments.findIndex(e => e.id === equipment.id);

    if (index !== -1) {
      // Actualizamos los datos en memoria
      this.equipments[index] = equipment;
    }

    // 🔁 Simulación de "persistencia" y refresco del listado
    // (esto imita el comportamiento de un backend que devuelve la lista actualizada)
    await this.refresh();

    return equipment;
  }

  /**
   * Elimina un equipo por su ID.
   */
  async delete(id: string): Promise<void> {
    this.equipments = this.equipments.filter(e => e.id !== id);
    await this.refresh(); // Refrescamos el estado para mantener coherencia visual
  }

  /**
   * Refresca internamente la lista de equipos (simula recarga desde backend).
   */
  private async refresh(): Promise<void> {
    // Simula un pequeño retardo (como una llamada HTTP)
    await new Promise(resolve => setTimeout(resolve, 100));
    this.equipments = [...this.equipments]; // fuerza actualización de referencia
  }
}
