// Componente standalone que implementa un formulario reactivo.
//  este archivo valida con Zod, mapea a entidad y llama al repositorio.

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private repo = inject(EquipmentRepository); // adapta la ruta si tu repo está en otro lugar
  private store = inject(EquipmentStore);
  private errorMapper = inject(ErrorMapper);

  // estados para la UI usando signals
  submitting = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  // FormGroup
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

  // Manejo del submit
  async onSubmit() {
    this.error.set(null);
    this.success.set(false);
    this.submitting.set(true);

    try {
      const raw = this.form.getRawValue();
      // validamos con Zod (UI)
      const parsed: EquipmentDTOInput = EquipmentDTOSchema.parse(raw);

      // mapear fechas a Date si vienen como string
      const entityLike: any = {
        ...parsed,
        purchaseDate: new Date(parsed.purchaseDate as any),
        warrantyEnd: new Date(parsed.warrantyEnd as any)
      };

      // llamar al repositorio (create o update)
      await this.repo.create(entityLike as Equipment);

      // refrescar la lista en la store
      if (typeof this.store.fetchAll === 'function') {
        await this.store.fetchAll();
      }

      this.success.set(true);
      this.form.markAsPristine();
    } catch (e: any) {
      this.error.set(this.errorMapper.toMessage(e));
    } finally {
      this.submitting.set(false);
    }
  }
}
