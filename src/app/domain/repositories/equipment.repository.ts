// ============================================================
// equipment.repository.ts
// Contrato abstracto que define las operaciones CRUD
// para la entidad "Equipment" (aplicando el principio DIP).
// ============================================================

import { Equipment } from '../models/equipment.model';

/**
 * Interfaz abstracta del repositorio de equipos.
 * Define las operaciones básicas de CRUD.
 */
export abstract class EquipmentRepository {
  // Obtiene todos los equipos disponibles. 
  abstract findAll(): Promise<Equipment[]>;

  // Busca un equipo por su ID. 
  abstract findById(id: string): Promise<Equipment | null>;

  // Crea un nuevo equipo. 
  abstract create(equipment: Equipment): Promise<Equipment>;

  // Actualiza un equipo existente. 
  abstract update(equipment: Equipment): Promise<Equipment>;

  // Elimina un equipo por su ID. 
  abstract delete(id: string): Promise<void>;
}
