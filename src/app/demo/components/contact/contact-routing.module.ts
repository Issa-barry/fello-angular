import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { ContactListeComponent } from './contact-liste/contact-liste.component';

const routes: Routes = [
   { path: '', component: ContactListeComponent }, 
   { path: 'contact-liste', loadChildren: () => import('./contact-liste/contact-liste.module').then(m => m.ContactListeModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
 