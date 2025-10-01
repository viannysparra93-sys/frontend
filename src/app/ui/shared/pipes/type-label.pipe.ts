import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeLabel',
  standalone: true
})
export class TypeLabelPipe implements PipeTransform {
  private map: Record<string, string> = {
    Laptop: 'Portátil',
    Desktop: 'Escritorio',
    Printer: 'Impresora',
    Monitor: 'Monitor',
    Server: 'Servidor',
    Other: 'Otro'
  };

  // Método que traduce el tipo técnico a un texto en español
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return this.map[value] ?? value;
  }
}
