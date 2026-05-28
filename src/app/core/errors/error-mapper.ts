import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorMapper {
  toMessage(error: unknown): string {
    if (!error) return 'Error desconocido';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return 'Ocurrió un error inesperado';
  }
}
