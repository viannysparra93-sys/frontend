// Página de lista de equipos: conecta con EquipmentStore, muestra filtros y paginación.
// NOTA: templateUrl/styleUrls apuntan a 'equipment-list-page.*' (coincide con tus archivos).

import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentStore } from '../../state/equipment.store';
import { EquipmentTableComponent } from '../../components/equipment-table/equipment-table.component';
import { RouterModule } from '@angular/router';

// Pipes
import { TypeLabelPipe } from '../../../../shared/pipes/type-label.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [
    CommonModule,
    EquipmentTableComponent,
    RouterModule,
    TypeLabelPipe,
    StatusLabelPipe
  ],
  // ---> IMPORTANTE: usar los nombres que realmente están en tu carpeta (con guion)
  templateUrl: './equipment-list.page.html',
  styleUrls: ['./equipment-list.page.css']
})
export class EquipmentListPage implements OnInit {
  private store = inject(EquipmentStore);

  loading = this.store.loading;
  error = this.store.error;

  paged = computed(() => this.store.paged());
  total = computed(() => this.store.total());
  page = computed(() => this.store.page());
  pageSize = computed(() => this.store.pageSize());
  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  statuses = ['Available','InUse','InRepair','Retired'] as const;
  types = ['Laptop','Desktop','Printer','Monitor','Server','Other'] as const;

  ngOnInit() {
    this.store.fetchAll();
  }

  reload() { this.store.fetchAll(); }

  onQuery(e: Event) { this.store.setQuery((e.target as HTMLInputElement).value); }
  onType(e: Event) { this.store.setType((e.target as HTMLSelectElement).value as any); }
  onStatus(e: Event) { this.store.setStatus((e.target as HTMLSelectElement).value as any); }
  onPageSize(e: Event) { this.store.setPageSize(parseInt((e.target as HTMLSelectElement).value, 10)); }

  previous() { this.store.setPage(Math.max(1, this.page() - 1)); }
  next() { this.store.setPage(Math.min(this.totalPages(), this.page() + 1)); }
}
