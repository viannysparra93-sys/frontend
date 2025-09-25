import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentStore } from '../../state/equipment.store';
import { EquipmentTableComponent } from '../../components/equipment-table/equipment-table.component';

@Component({
  selector: 'app-equipment-list-table',
  standalone: true,
  imports: [
    CommonModule,        // funcionalidades básicas de Angular
    EquipmentTableComponent // tu tabla personalizada
  ],
  templateUrl: './equipment-list-page.component.html',
  styleUrls: ['./equipment-list-page.component.css'] // en plural y array
})
export class EquipmentListPageComponent implements OnInit {
  private readonly store = inject(EquipmentStore);

  readonly equipments = this.store.equipments;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  async ngOnInit(): Promise<void> {
    await this.store.loadEquipments();
  }
}
