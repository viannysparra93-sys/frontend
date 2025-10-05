import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Equipment } from '../../../../../domain/models/equipment.model';

// Pipes para mostrar etiquetas legibles en la tabla
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { TypeLabelPipe } from '../../../../shared/pipes/type-label.pipe';

// Store para manejar el estado de los equipos
import { EquipmentStore } from '../../state/equipment.store';

@Component({
  selector: 'app-equipment-table',
  standalone: true,
  // Importamos módulos y pipes necesarios
  imports: [CommonModule, RouterModule, StatusLabelPipe, TypeLabelPipe],
  templateUrl: './equipment-table.component.html',
  styleUrls: ['./equipment-table.component.css']
})
export class EquipmentTableComponent {
  @Input() data: Equipment[] = [];

  // Inyectamos la store para acceder a las operaciones de CRUD
  private store = inject(EquipmentStore);

  /**
   * Elimina un equipo por su ID
   * Se pide confirmación antes de ejecutar la acción
   */
  onDelete(id: string) {
    if (confirm('¿Seguro que quieres eliminar este equipo?')) {
      this.store.delete(id);
    }
  }
}
