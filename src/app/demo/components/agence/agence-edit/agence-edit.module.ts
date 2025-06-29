import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgenceEditRoutingModule } from './agence-edit-routing.module';
import { AgenceEditComponent } from './agence-edit.component';


@NgModule({
  declarations: [
    AgenceEditComponent
  ],
  imports: [
    CommonModule,
    AgenceEditRoutingModule
  ]
})
export class AgenceEditModule { }
