// equipment-http.repository.ts
// Repositorio HTTP de equipos
// Implementa el contrato EquipmentRepository usando HttpClient para comunicarse con JSON Server

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EquipmentRepository } from '../../domain/repositories/equipment.repository';
import { Equipment } from '../../domain/models/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentHttpRepository implements EquipmentRepository {
  private readonly baseUrl = 'http://localhost:3000/equipment';

  constructor(private http: HttpClient) {}

  
   //Obtener todos los equipos
   
  async findAll(): Promise<Equipment[]> {
    try {
      return await firstValueFrom(this.http.get<Equipment[]>(this.baseUrl));
    } catch (error) {
      console.error('Error al obtener los equipos:', error);
      return [];
    }
  }

  
   // Obtener un equipo por su ID
   
  async findById(id: string): Promise<Equipment | null> {
    try {
      return await firstValueFrom(this.http.get<Equipment>(`${this.baseUrl}/${id}`));
    } catch (error) {
      console.error(`Error al obtener el equipo con ID ${id}:`, error);
      return null;
    }
  }

  
   //Crear un nuevo equipo
   
  async create(equipment: Equipment): Promise<Equipment> {
    try {
      // Eliminamos el id para permitir que JSON Server genere uno automáticamente
      const { id, ...newEquipment } = equipment;

      return await firstValueFrom(
        this.http.post<Equipment>(this.baseUrl, newEquipment)
      );
    } catch (error) {
      console.error('Error al crear el equipo:', error);
      throw error;
    }
  }

  
  // Actualizar un equipo existente
   
  async update(equipment: Equipment): Promise<Equipment> {
    try {
      return await firstValueFrom(
        this.http.put<Equipment>(`${this.baseUrl}/${equipment.id}`, equipment)
      );
    } catch (error) {
      console.error(`Error al actualizar el equipo con ID ${equipment.id}:`, error);
      throw error;
    }
  }

  
   // Eliminar un equipo
   
  async delete(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
    } catch (error) {
      console.error(`Error al eliminar el equipo con ID ${id}:`, error);
      throw error;
    }
  }
}
