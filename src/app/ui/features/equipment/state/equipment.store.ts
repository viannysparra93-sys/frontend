import { computed, inject, Injectable, signal } from '@angular/core';
import { LoadEquipmentListUseCase } from '../../../../application/use-cases/load-equipment-list.use-case';
import { Equipment } from '../../../../domain/models/equipment.model';

type Status = 'Available' | 'InUse' | 'InRepair' | 'Retired' | 'All';
type Type = 'Laptop' | 'Desktop' | 'Printer' | 'Monitor' | 'Server' | 'Other' | 'All';

@Injectable({ providedIn: 'root' })
export class EquipmentStore {
  private readonly loadList = inject(LoadEquipmentListUseCase);

  // datos originales
  readonly items = signal<Equipment[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // filtros UI
  readonly query = signal<string>('');
  readonly status = signal<Status>('All');
  readonly type = signal<Type>('All');

  // paginación
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);

  
  readonly total = computed(() => this.filtered().length);

  // fetchAll se encarga de cargar items (sin tocar total manualmente)
  async fetchAll() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.loadList.execute();
      this.items.set(data);
      this.page.set(1);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Unexpected error');
    } finally {
      this.loading.set(false);
    }
  }

  // items filtrados por query/status/type (computed puro, sin efectos)
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

  // items paginados (computed puro)
  readonly paged = computed(() => {
    const data = this.filtered();
    const start = (this.page() - 1) * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  // setters
  setQuery(q: string) { this.query.set(q); this.page.set(1); }
  setStatus(s: Status) { this.status.set(s); this.page.set(1); }
  setType(t: Type) { this.type.set(t); this.page.set(1); }
  setPage(n: number) { this.page.set(n); }
  setPageSize(n: number) { this.pageSize.set(n); this.page.set(1); }
}
