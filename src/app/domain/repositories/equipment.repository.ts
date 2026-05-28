import { Equipment } from '../models/equipment.model';

export abstract class EquipmentRepository {
  abstract getAll(): Promise<Equipment[]>;
  abstract getById(id: string): Promise<Equipment | null>;
  abstract create(equipment: Equipment): Promise<void>;
  abstract update(equipment: Equipment): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
