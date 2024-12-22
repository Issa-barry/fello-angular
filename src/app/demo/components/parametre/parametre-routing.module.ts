import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  { path: '', component: GeneralComponent }, 
  { path: 'general', loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametreRoutingModule { }
