import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransfertDetailRoutingModule } from './transfert-detail-routing.module';
import { ChipModule } from 'primeng/chip';
import { TransfertDetailComponent } from './transfert-detail.component';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [TransfertDetailComponent],
  imports: [
    CommonModule,
    TransfertDetailRoutingModule,
    ButtonModule,
    RippleModule
    
  ]
})
export class TransfertDetailModule { }
