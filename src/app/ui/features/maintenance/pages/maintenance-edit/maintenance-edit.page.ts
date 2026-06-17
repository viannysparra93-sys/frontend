import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { EquipmentDTO } from '../../../../../shared/contracts/equipment.contract';
import { EquipmentHttpRepository } from '../../../../../infrastructure/equipment/equipment-http.repository';

@Component({
  selector: 'app-maintenance-edit',
  standalone: true,
  templateUrl: './maintenance-edit.page.html',
  styleUrls: ['./maintenance-edit.page.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule
  ]
})
export class MaintenanceEditPage {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  loaded = false;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private repo = inject(EquipmentHttpRepository);

  constructor() {
    // El formulario incluye 'id' para asegurar que payload tenga id al actualizar
    this.form = this.fb.group({
      id: [''],
      assetTag: ['', Validators.required],
      serialNumber: [''],
      model: [''],
      type: [''],
      status: ['active', Validators.required],
      locationId: [''],
      purchaseDate: [''],
      warrantyEnd: [''],
      metadata: [{}]
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID inválido';
      return;
    }

    this.loading = true;
    try {
      const found = await this.repo.findById(id);
      if (!found) {
        this.error = 'No se encontró el equipo';
        return;
      }
      // patchValue para mapear los campos que existan
      this.form.patchValue(found as any);
      this.loaded = true;
    } catch (err: any) {
      this.error = err?.message ?? 'Error al cargar datos';
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    try {
      // Aseguramos que payload tenga el id (viene del formulario o de la ruta)
      const idFromRoute = this.route.snapshot.paramMap.get('id');
      const formValues = this.form.value;

      const payload: EquipmentDTO = {
        id: formValues.id ?? idFromRoute ?? '',
        assetTag: formValues.assetTag,
        serialNumber: formValues.serialNumber ?? '',
        model: formValues.model ?? '',
        type: formValues.type ?? ('' as any),
        status: formValues.status ?? 'active',
        locationId: formValues.locationId ?? '',
        purchaseDate: formValues.purchaseDate ?? '',
        warrantyEnd: formValues.warrantyEnd ?? '',
        metadata: formValues.metadata ?? {}
      };

      // Si el repositorio espera el tipo domain Equipment y no DTO,
      // forzamos el cast para evitar error de tipo en tiempo de compilación.
      await this.repo.update(payload as any);

      // Navegar de regreso al listado
      await this.router.navigate(['/maintenance']);
    } catch (err: any) {
      this.error = err?.message ?? 'Error al actualizar el mantenimiento';
    } finally {
      this.loading = false;
    }
  }
}
