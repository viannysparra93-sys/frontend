// ----------------------------------------------------------
// Contrato del repositorio de equipos
// ----------------------------------------------------------
// Esta clase abstracta define las operaciones básicas (CRUD)
// que cualquier repositorio de equipos debe implementar.
// No tiene lógica, solo define el “qué” se puede hacer.
// ----------------------------------------------------------

import { Equipment } from '../models/equipment.model';

export abstract class EquipmentRepository {
  // Obtener todos los equipos registrados
  abstract findAll(): Promise<Equipment[]>;

  // Buscar un equipo específico por su ID
  abstract findById(id: string): Promise<Equipment | null>;

  // Crear un nuevo equipo y devolver el que se creó
  abstract create(equipment: Equipment): Promise<Equipment>;

  // Actualizar un equipo existente y devolver el actualizado
  abstract update(equipment: Equipment): Promise<Equipment>;

  // Eliminar un equipo por ID (aquí no se devuelve nada)
  abstract delete(id: string): Promise<void>;
}
