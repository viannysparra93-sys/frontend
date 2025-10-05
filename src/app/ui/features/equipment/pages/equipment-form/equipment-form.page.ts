/*
 * Este componente permite registrar o editar equipos.
 * Utiliza formularios reactivos (Reactive Forms), validaciones con Zod,
 * y conexión con el repositorio y el store para manejar los datos.
 * 
 * En modo "crear", asigna un ID incremental automáticamente.
 * En modo "editar", carga los datos existentes y permite modificarlos
 * sin tener que volver a escribir toda la información.
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // 👈 Router agregado aquí
import { Equipment } from '../../../../../domain/models/equipment.model';
import { EquipmentRepository } from '../../../../../domain/repositories/equipment.repository';
import { EquipmentDTOSchema, EquipmentDTOInput } from '../../schemas/equipment.zod';
import { EquipmentStore } from '../../state/equipment.store';
import { ErrorMapper } from '../../../../../core/errors/error-mapper';

@Component({
  selector: 'app-equipment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipment-form.page.html',
  styleUrls: ['./equipment-form.page.css']
})
export class EquipmentFormPage {

  // --- Dependencias principales ---
  private fb = inject(FormBuilder);
  private repo = inject(EquipmentRepository);
  private store = inject(EquipmentStore);
  private errorMapper = inject(ErrorMapper);
  private route = inject(ActivatedRoute);
  private router = inject(Router); // 👈 se usa para navegar al cancelar o guardar

  // --- Señales de estado (signals) ---
  isEdit = signal(false);
  submitting = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  // --- Formulario reactivo ---
  form = this.fb.group({
    id: this.fb.control<string>(crypto.randomUUID(), { nonNullable: true }),
    assetTag: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    serialNumber: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    model: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    type: this.fb.control<'Laptop'|'Desktop'|'Printer'|'Monitor'|'Server'|'Other'>('Laptop' as any, { nonNullable: true }),
    status: this.fb.control<'Available'|'InUse'|'InRepair'|'Retired'>('Available' as any, { nonNullable: true }),
    locationId: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    purchaseDate: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    warrantyEnd: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    metadata: this.fb.control<Record<string, unknown>>({}, { nonNullable: true })
  });

  constructor() {
    // Si la URL contiene un ID, el formulario se comporta en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.loadExistingEquipment(id);
    }
  }

  /**
   * Carga los datos del equipo existente y los prellena en el formulario.
   */
  private async loadExistingEquipment(id: string): Promise<void> {
    try {
      const existing = await this.repo.findById(id);
      if (!existing) return;

      // Convertimos fechas a formato compatible con el input date
      const formatDateToInput = (d: Date) => {
        const date = new Date(d);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Llenamos el formulario con los datos existentes
      this.form.patchValue({
        id: existing.id,
        assetTag: existing.assetTag,
        serialNumber: existing.serialNumber,
        model: existing.model,
        type: existing.type as any,
        status: existing.status as any,
        locationId: existing.locationId,
        purchaseDate: formatDateToInput(existing.purchaseDate as any),
        warrantyEnd: formatDateToInput(existing.warrantyEnd as any),
        metadata: this.metadataToRecord(existing.metadata)
      });
    } catch (error) {
      console.error('Error cargando equipo existente:', error);
      this.error.set('No se pudo cargar el equipo para edición.');
    }
  }

  /**
   * Convierte metadata que pueda venir como Map<string, any> a Record<string, unknown>.
   * Si ya es un objeto, lo retorna tal cual. Si es otra cosa, retorna {}.
   */
  private metadataToRecord(m: unknown): Record<string, unknown> {
    if (!m) return {};
    if (m instanceof Map) {
      const obj: Record<string, unknown> = {};
      for (const [k, v] of m.entries()) {
        obj[String(k)] = v;
      }
      return obj;
    }
    if (typeof m === 'object' && !Array.isArray(m)) {
      return m as Record<string, unknown>;
    }
    return {};
  }

  /**
   * Calcula el siguiente ID incremental, en caso de crear un nuevo equipo.
   * Si hay 10 equipos y se crea uno nuevo, su ID será "11".
   */
  private async getNextId(): Promise<string> {
    const all = await this.repo.findAll();
    const maxId = Math.max(...all.map(eq => Number(eq.id) || 0), 0);
    return String(maxId + 1);
  }

  /**
   * Acción que ocurre al enviar el formulario (crear o actualizar).
   */
  async onSubmit() {
    this.error.set(null);
    this.success.set(false);
    this.submitting.set(true);

    try {
      const raw = this.form.getRawValue();
      console.log('Datos del formulario:', raw);

      // Validación con Zod
      const parsed: EquipmentDTOInput = EquipmentDTOSchema.parse(raw);

      // Conversión de fechas a objetos Date
      const entityLike: any = {
        ...parsed,
        purchaseDate: new Date(parsed.purchaseDate as any),
        warrantyEnd: new Date(parsed.warrantyEnd as any)
      };

      if (this.isEdit()) {
        // Actualización
        await this.repo.update(entityLike as Equipment);
      } else {
        // Asignar ID incremental para nuevo registro
        entityLike.id = await this.getNextId();
        await this.repo.create(entityLike as Equipment);
      }

      // Refrescamos la lista
      if (typeof this.store.fetchAll === 'function') {
        await this.store.fetchAll();
      }

      this.success.set(true);
      this.form.markAsPristine();

    } catch (e: any) {
      console.error('Error al guardar equipo:', e);

      if (e.errors) {
        // Errores de validación de Zod
        this.error.set(
          e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(' | ')
        );
      } else {
        // Errores generales
        this.error.set(this.errorMapper.toMessage(e));
      }

    } finally {
      this.submitting.set(false);
    }
  }

  /**
   * Acción para cancelar y volver al listado de equipos.
   * Usamos un método público para no exponer directamente la propiedad 'router' en el HTML.
   */
  public onCancel(): void {
    this.router.navigate(['/equipment']);
  }
}