import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgenceNewRoutingModule } from './agence-new-routing.module';
import { AgenceNewComponent } from './agence-new.component';


@NgModule({
  declarations: [
    AgenceNewComponent
  ],
  imports: [
    CommonModule,
    AgenceNewRoutingModule
  ]
})
export class AgenceNewModule { }
