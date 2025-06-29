import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgenceComponent } from './agence.component';

const routes: Routes = [{ path: '', component: AgenceComponent }, { path: 'new-agence', loadChildren: () => import('./agence-new/agence-new.module').then(m => m.AgenceNewModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgenceRoutingModule { }
