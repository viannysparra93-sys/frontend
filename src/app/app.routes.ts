import { Routes } from '@angular/router';
import { EquipmentListPage } from './ui/features/equipment/pages/equipment-list/equipment-list.page';
import { EquipmentFormPage } from './ui/features/equipment/pages/equipment-form/equipment-form.page';

export const routes: Routes = [
  { path: '', redirectTo: 'equipment', pathMatch: 'full' },
  {
    path: 'equipment',
    children: [
      { path: '', component: EquipmentListPage },
      { path: 'new', component: EquipmentFormPage },
      { path: ':id/edit', component: EquipmentFormPage }
    ]
  }
];
