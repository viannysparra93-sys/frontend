import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EquipmentRepository } from '../../domain/repositories/equipment.repository';
import { Equipment } from '../../domain/models/equipment.model';

@Injectable({ providedIn: 'root' })
export class EquipmentHttpRepository implements EquipmentRepository {
  constructor(private http: HttpClient) {}

  async getAll(): Promise<Equipment[]> {
    return await firstValueFrom(this.http.get<Equipment[]>('/equipments'));
  }

  async getById(id: string): Promise<Equipment | null> {
    return await firstValueFrom(this.http.get<Equipment>(`/equipments/${id}`));
  }

  async create(equipment: Equipment): Promise<void> {
    await firstValueFrom(this.http.post('/equipments', equipment));
  }

  async update(equipment: Equipment): Promise<void> {
    await firstValueFrom(this.http.put(`/equipments/${equipment.id}`, equipment));
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`/equipments/${id}`));
  }
}
