import { Routes } from '@angular/router';
import { EquipmentListPage } from './ui/features/equipment/pages/equipment-list/equipment-list.page';
import { EquipmentFormPage } from './ui/features/equipment/pages/equipment-form/equipment-form.page';

//  Rutas principales de la aplicación
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'equipment',
    pathMatch: 'full',
  },

  // CRUD de Equipos
  {
    path: 'equipment',
    children: [
      { path: '', component: EquipmentListPage },
      { path: 'new', component: EquipmentFormPage },
      { path: ':id/edit', component: EquipmentFormPage },
    ],
  },

  // CRUD de Mantenimientos
  {
    path: 'maintenance',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./ui/features/maintenance/pages/maintenance-list/maintenance-list.page').then(
            (m) => m.MaintenanceListPage
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./ui/features/maintenance/pages/maintenance-create/maintenance-create.page').then(
            (m) => m.MaintenanceCreatePage
          ),
        // IMPORTANTE:
        // Al cargar el componente, también importamos los módulos necesarios
        // para evitar errores de *ngIf, formGroup, etc.
        data: {
          imports: [
            import('@angular/common').then((m) => m.CommonModule),
            import('@angular/forms').then((m) => m.ReactiveFormsModule),
            import('@angular/forms').then((m) => m.FormsModule),
            import('@ionic/angular').then((m) => m.IonicModule),
          ],
        },
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./ui/features/maintenance/pages/maintenance-edit/maintenance-edit.page').then(
            (m) => m.MaintenanceEditPage
          ),
        data: {
          imports: [
            import('@angular/common').then((m) => m.CommonModule),
            import('@angular/forms').then((m) => m.ReactiveFormsModule),
            import('@angular/forms').then((m) => m.FormsModule),
            import('@ionic/angular').then((m) => m.IonicModule),
          ],
        },
      },
    ],
  },
];
