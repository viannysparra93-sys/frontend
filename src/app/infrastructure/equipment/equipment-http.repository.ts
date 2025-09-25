import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Equipment } from '../../domain/models/equipment.model';
import { EquipmentRepository } from '../../domain/repositories/equipment.repository';

@Injectable({ providedIn: 'root' })
export class EquipmentHttpRepository implements EquipmentRepository {
  constructor(private http: HttpClient) {}

  async getAll(): Promise<Equipment[]> {
    // devolvemos [] si no hay datos
    return (await this.http.get<Equipment[]>('equipment').toPromise()) ?? [];
  }

  async getById(id: string): Promise<Equipment | null> {
    return (await this.http.get<Equipment>(`equipment/${id}`).toPromise()) ?? null;
  }

  async create(equipment: Equipment): Promise<void> {
    await this.http.post('equipment', equipment).toPromise();
  }

  async update(equipment: Equipment): Promise<void> {
    await this.http.put(`equipment/${equipment.id}`, equipment).toPromise();
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`equipment/${id}`).toPromise();
  }
}
