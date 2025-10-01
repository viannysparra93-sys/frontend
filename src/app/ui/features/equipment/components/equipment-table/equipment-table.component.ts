import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Equipment } from '../../../../../domain/models/equipment.model';

// Importamos los pipes recién creados
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { TypeLabelPipe } from '../../../../shared/pipes/type-label.pipe';

@Component({
  selector: 'app-equipment-table',
  standalone: true,
  // Importamos CommonModule y los pipes
  imports: [CommonModule, StatusLabelPipe, TypeLabelPipe],
  templateUrl: './equipment-table.component.html',
  styleUrls: ['./equipment-table.component.css']
})
export class EquipmentTableComponent {
  @Input() data: Equipment[] = [];
}
