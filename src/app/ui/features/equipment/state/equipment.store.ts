import { computed, inject, Injectable, signal } from '@angular/core';
import { LoadEquipmentListUseCase } from '../../../../application/use-cases/load-equipment-list.use-case';
import { Equipment } from '../../../../domain/models/equipment.model';
import { EquipmentRepository } from '../../../../domain/repositories/equipment.repository';

type Status = 'Available' | 'InUse' | 'InRepair' | 'Retired' | 'All';
type Type = 'Laptop' | 'Desktop' | 'Printer' | 'Monitor' | 'Server' | 'Other' | 'All';

@Injectable({ providedIn: 'root' })
export class EquipmentStore {
  private readonly loadList = inject(LoadEquipmentListUseCase);
  private readonly repo = inject(EquipmentRepository);

  // estado base (lista, loading y error)
  readonly items = signal<Equipment[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // filtros que vienen de la UI
  readonly query = signal<string>('');
  readonly status = signal<Status>('All');
  readonly type = signal<Type>('All');

  // paginación
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);

  // total de registros filtrados (no lo guardamos, lo calculamos siempre)
  readonly total = computed(() => this.filtered().length);

  /**
   * Cargar todos los equipos (desde el caso de uso)
   */
  async fetchAll() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.loadList.execute(); // trae los equipos
      this.items.set(data); // guardamos en el estado
      this.page.set(1); // siempre vuelvo a la primera página
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error inesperado al cargar equipos');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Crear un nuevo equipo
   */
  async create(equipment: Equipment) {
    this.loading.set(true);
    try {
      // repo debería devolver el equipo creado, si no lo hace, usamos el mismo que mandamos
      const created = (await this.repo.create(equipment)) ?? equipment;
      this.items.update(list => [...list, created]);
    } catch (err: any) {
      this.error.set(err?.message ?? 'No se pudo crear el equipo');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Actualizar un equipo existente
   */
  async update(equipment: Equipment) {
    this.loading.set(true);
    try {
      // repo debería devolver el actualizado, si no lo hace, usamos el mismo
      const updated = (await this.repo.update(equipment)) ?? equipment;
      this.items.update(list =>
        list.map(e => (e.id === updated.id ? updated : e))
      );
    } catch (err: any) {
      this.error.set(err?.message ?? 'No se pudo actualizar el equipo');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Eliminar un equipo por su ID
   */
  async delete(id: string) {
    this.loading.set(true);
    try {
      await this.repo.delete(id); // repo borra, no devuelve nada
      this.items.update(list => list.filter(e => e.id !== id));
    } catch (err: any) {
      this.error.set(err?.message ?? 'No se pudo eliminar el equipo');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Filtros (búsqueda, estado, tipo)
   */
  readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    const s = this.status();
    const t = this.type();

    return this.items().filter(equipment => {
      const byQuery = !q
        || equipment.assetTag?.toLowerCase().includes(q)
        || equipment.serialNumber?.toLowerCase().includes(q)
        || equipment.model?.toLowerCase().includes(q);

      const byStatus = s === 'All' || equipment.status === s;
      const byType = t === 'All' || equipment.type === t;

      return byQuery && byStatus && byType;
    });
  });

  /**
   * Paginación: datos que se muestran en la página actual
   */
  readonly paged = computed(() => {
    const data = this.filtered();
    const start = (this.page() - 1) * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  // helpers (para que la UI cambie filtros y página)
  setQuery(q: string) { this.query.set(q); this.page.set(1); }
  setStatus(s: Status) { this.status.set(s); this.page.set(1); }
  setType(t: Type) { this.type.set(t); this.page.set(1); }
  setPage(n: number) { this.page.set(n); }
  setPageSize(n: number) { this.pageSize.set(n); this.page.set(1); }
}
