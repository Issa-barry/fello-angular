import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgenceComponent } from './agence.component';

const routes: Routes = [{ path: '', component: AgenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgenceRoutingModule { }
