import { Routes } from '@angular/router';
import { EquipmentListPageComponent } from './ui/features/equipment/pages/equipment-list/equipment-list-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'equipment', pathMatch: 'full' },
  { path: 'equipment', component: EquipmentListPageComponent }
];
