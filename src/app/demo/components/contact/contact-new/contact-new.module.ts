import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactNewRoutingModule } from './contact-new-routing.module';
import { FormsModule } from '@angular/forms';
import { ProfileCreateRoutingModule } from '../../profile/create/profilecreate-routing.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ContactNewComponent } from './contact-new.component';
import { PasswordModule } from 'primeng/password';


@NgModule({
  declarations: [ContactNewComponent],
  imports: [
    CommonModule,
    ContactNewRoutingModule,
    FormsModule,
    ProfileCreateRoutingModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    InputTextareaModule,
    InputGroupModule,
    InputGroupAddonModule, 
    PasswordModule
  ]
})
export class ContactNewModule { }
  