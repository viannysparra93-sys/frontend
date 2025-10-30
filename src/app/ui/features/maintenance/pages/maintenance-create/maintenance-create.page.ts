import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

//  Imports corregidos
import { EquipmentDTO } from '../../../../../shared/contracts/equipment.contract';
import { EquipmentHttpRepository } from '../../../../../infrastructure/equipment/equipment-http.repository';

@Component({
  selector: 'app-maintenance-create',
  standalone: true, // No depende de un módulo
  templateUrl: './maintenance-create.page.html',
  styleUrls: ['./maintenance-create.page.css'],
  imports: [CommonModule, ReactiveFormsModule, IonicModule], // Permite usar directivas y formularios
})
export class MaintenanceCreatePage {
  form: FormGroup;
  loading = false;
  error: string | null = null;

  // Inyección de dependencias corregida
  private repo = inject(EquipmentHttpRepository);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    //  Definición del formulario reactivo
    this.form = this.fb.group({
      assetTag: ['', Validators.required],
      serialNumber: [''],
      model: [''],
      type: [''],
      status: ['active', Validators.required],
      location: [''],
    });
  }

  //  Método para enviar el formulario
  async onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;

    try {
      const payload = {
  ...this.form.value,
  isActive: true,
  canBeMaintained: true
} as any;

await this.repo.create(payload);

      this.router.navigate(['/maintenance']); // Redirige a la lista de mantenimientos
    } catch (err) {
      const e = err as any;
      this.error = e?.message ?? 'Error al crear el equipo';
    } finally {
      this.loading = false;
    }
  }
}
