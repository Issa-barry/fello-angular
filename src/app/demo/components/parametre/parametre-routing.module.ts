import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  { path: '', data: {breadcrumb: 'Parametre'}, component: GeneralComponent }, 
  { path: 'general', data: {breadcrumb: 'Général'}, loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) },
  { path: 'role-liste',data: {breadcrumb: 'Paramétre/Role/Liste'}, loadChildren: () => import('./role-liste/role-liste.module').then(m => m.RoleListeModule) },
  { path: 'role-detail/:id',data: {breadcrumb: 'Paramétre > Role > détail'}, loadChildren: () => import('./role-detail/role-detail.module').then(m => m.RoleDetailModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametreRoutingModule { }
 