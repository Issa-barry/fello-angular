import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  { path: '', component: GeneralComponent }, 
  { path: 'general', loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) },
  { path: 'role', loadChildren: () => import('./role/role.module').then(m => m.RoleModule) },
  { path: 'role-liste', loadChildren: () => import('./role-liste/role-liste.module').then(m => m.RoleListeModule) },
  { path: 'role-detail/:id', loadChildren: () => import('./role-detail/role-detail.module').then(m => m.RoleDetailModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametreRoutingModule { }
 