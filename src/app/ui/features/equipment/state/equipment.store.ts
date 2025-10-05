// Servicio de estado (Store) que maneja los equipos en memoria.
// Se encarga de conectar la UI con el repositorio de datos (FakeRepository).
// Implementa operaciones CRUD y filtros sin depender de un backend real.

import { computed, inject, Injectable, signal } from '@angular/core';
import { LoadEquipmentListUseCase } from '../../../../application/use-cases/load-equipment-list.use-case';
import { Equipment } from '../../../../domain/models/equipment.model';
import { EquipmentRepository } from '../../../../domain/repositories/equipment.repository';

// Definición de tipos para filtros
type Status = 'Available' | 'InUse' | 'InRepair' | 'Retired' | 'All';
type Type = 'Laptop' | 'Desktop' | 'Printer' | 'Monitor' | 'Server' | 'Other' | 'All';

@Injectable({ providedIn: 'root' })
export class EquipmentStore {
  // Inyección de dependencias
  private readonly loadList = inject(LoadEquipmentListUseCase);
  private readonly repo = inject(EquipmentRepository);

  // --- ESTADOS BASE ---
  readonly items = signal<Equipment[]>([]);          // lista de equipos
  readonly loading = signal(false);                  // indicador de carga
  readonly error = signal<string | null>(null);      // mensaje de error

  // --- FILTROS ---
  readonly query = signal<string>('');               // texto de búsqueda
  readonly status = signal<Status>('All');           // filtro por estado
  readonly type = signal<Type>('All');               // filtro por tipo

  // --- PAGINACIÓN ---
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);

  // Total de equipos filtrados
  readonly total = computed(() => this.filtered().length);

  /**
   * Carga inicial de equipos (desde el caso de uso).
   */
  async fetchAll() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.loadList.execute();
      this.items.set(data);
      this.page.set(1);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al cargar equipos');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Crear un nuevo equipo.
   * Se añade al arreglo actual sin recargar todo.
   */
  async create(equipment: Equipment) {
    this.loading.set(true);
    try {
      const created = (await this.repo.create(equipment)) ?? equipment;
      this.items.update(list => [...list, created]);
    } catch (err: any) {
      this.error.set(err?.message ?? 'No se pudo crear el equipo');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Actualizar un equipo existente.
   * Si el ID ya existe en la lista, reemplaza ese equipo por el actualizado.
   */
  async update(equipment: Equipment) {
    this.loading.set(true);
    try {
      const updated = (await this.repo.update(equipment)) ?? equipment;

      // Actualiza el equipo en la lista local usando la misma instancia update
      this.items.update(list =>
        list.map(e => (e.id === updated.id ? updated : e))
      );

      // Recargamos la lista desde el repositorio (por coherencia)
      // Esto asegura que la tabla muestre los datos actuales.
      const refreshed = await this.repo.findAll();
      this.items.set(refreshed);

    } catch (err: any) {
      this.error.set(err?.message ?? 'No se pudo actualizar el equipo');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Eliminar un equipo por su ID.
   */
  async delete(id: string) {
    this.loading.set(true);
    try {
      await this.repo.delete(id);
      this.items.update(list => list.filter(e => e.id !== id));
    } catch (err: any) {
      this.error.set(err?.message ?? 'No se pudo eliminar el equipo');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Filtra los equipos según la búsqueda, tipo y estado.
   */
  readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    const s = this.status();
    const t = this.type();

    return this.items().filter(equipment => {
      const byQuery =
        !q ||
        equipment.assetTag?.toLowerCase().includes(q) ||
        equipment.serialNumber?.toLowerCase().includes(q) ||
        equipment.model?.toLowerCase().includes(q);

      const byStatus = s === 'All' || equipment.status === s;
      const byType = t === 'All' || equipment.type === t;

      return byQuery && byStatus && byType;
    });
  });

  /**
   * Obtiene los datos que se muestran en la página actual.
   */
  readonly paged = computed(() => {
    const data = this.filtered();
    const start = (this.page() - 1) * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  // --- MÉTODOS AUXILIARES ---
  setQuery(q: string) { this.query.set(q); this.page.set(1); }
  setStatus(s: Status) { this.status.set(s); this.page.set(1); }
  setType(t: Type) { this.type.set(t); this.page.set(1); }
  setPage(n: number) { this.page.set(n); }
  setPageSize(n: number) { this.pageSize.set(n); this.page.set(1); }
}
