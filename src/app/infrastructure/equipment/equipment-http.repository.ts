// Repositorio HTTP de equipos

// Esta clase implementa el contrato EquipmentRepository pero utilizando
// HttpClient de Angular para comunicarse con nuestro backend falso
// (en este caso, un servidor JSON local que corre en el puerto 3000).


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EquipmentRepository } from '../../domain/repositories/equipment.repository';
import { Equipment } from '../../domain/models/equipment.model';

@Injectable({ providedIn: 'root' })
export class EquipmentHttpRepository implements EquipmentRepository {
  private readonly baseUrl = 'http://localhost:3000/equipment';

  constructor(private http: HttpClient) {}

  
  // Obtener todos los equipos
  
  async findAll(): Promise<Equipment[]> {
    return await firstValueFrom(this.http.get<Equipment[]>(this.baseUrl));
  }

 
  // Obtener un equipo por ID
  
  async findById(id: string): Promise<Equipment | null> {
    return await firstValueFrom(this.http.get<Equipment>(`${this.baseUrl}/${id}`));
  }

  
  // Crear un nuevo equipo
  
  async create(equipment: Equipment): Promise<Equipment> {
  // metodo para eliminar el id antes de enviarlo, para que JSON Server genere uno numérico automáticamente en ves de uno universal automáticamente
  const { id, ...newEquipment } = equipment;

  return await firstValueFrom(
    this.http.post<Equipment>(this.baseUrl, newEquipment)
  );
}

  
  // Actualizar un equipo existente

  async update(equipment: Equipment): Promise<Equipment> {
  // Mantenemos el id para actualizar correctamente
  return await firstValueFrom(
    this.http.put<Equipment>(`${this.baseUrl}/${equipment.id}`, equipment)
  );
}


  
  // Eliminar un equipo
  
  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
  }
}

