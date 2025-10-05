// Este componente es para registrar o editar equipos.
// Usa formularios reactivos y validaciones con Angular y Zod.
// Nota: todavía se podría mejorar el manejo de errores (TODO).

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // 👈 Import necesario
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
  private fb = inject(FormBuilder);
  private repo = inject(EquipmentRepository);
  private store = inject(EquipmentStore);
  private errorMapper = inject(ErrorMapper);
  private route = inject(ActivatedRoute); // 👈 para leer la URL

  // Nuevo: bandera para saber si es edición o registro
  isEdit = false;

  // Estados simples para la UI
  submitting = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  // Formulario con campos obligatorios
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
    // Revisamos si la URL tiene un id → significa que estamos en edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      // TODO: aquí se podría cargar el equipo por id y rellenar el formulario
    }
  }

  // Enviar formulario
  async onSubmit() {
    this.error.set(null);
    this.success.set(false);
    this.submitting.set(true);

    try {
      const raw = this.form.getRawValue();
      console.log('Datos crudos del formulario:', raw); // Debug

      // Validamos con Zod antes de enviar
      const parsed: EquipmentDTOInput = EquipmentDTOSchema.parse(raw);

      // TODO: revisar si conviene validar fechas en otro lado
      const entityLike: any = {
        ...parsed,
        purchaseDate: new Date(parsed.purchaseDate as any),
        warrantyEnd: new Date(parsed.warrantyEnd as any)
      };

      // Guardar en el repositorio (por ahora siempre create)
      await this.repo.create(entityLike as Equipment);

      // Refrescar la lista
      if (typeof this.store.fetchAll === 'function') {
        await this.store.fetchAll();
      }

      this.success.set(true);
      this.form.markAsPristine();
    } catch (e: any) {
      console.error('Error al guardar equipo:', e); // Debug
      if (e.errors) {
        // Errores de Zod (ej: campos inválidos)
        this.error.set(
          e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(' | ')
        );
      } else {
        // Errores de negocio / red
        this.error.set(this.errorMapper.toMessage(e));
      }
    } finally {
      this.submitting.set(false);
    }
  }
}
