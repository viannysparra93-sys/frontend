import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
  standalone: true // Permite importar directamente en componentes standalone
})
export class StatusLabelPipe implements PipeTransform {
  private map: Record<string, string> = {
    Available: 'Disponible',
    InUse: 'En uso',
    InRepair: 'En reparación',
    Retired: 'Retirado'
  };

  // Método que traduce el estado técnico a un texto en español
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return this.map[value] ?? value;
  }
}
