// frontend/src/app/ui/features/equipment/components/equipment-table/equipment-table.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Equipment } from '../../../../../domain/models/equipment.model';


@Component({
  selector: 'app-equipment-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipment-table.component.html',
  styleUrls: ['./equipment-table.component.css']
})
export class EquipmentTableComponent {
 
  @Input() data: Equipment[] = [];
}