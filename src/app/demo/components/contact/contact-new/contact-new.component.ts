import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/demo/models/contact';
import { Role } from 'src/app/demo/models/Role';
import { ContactService } from 'src/app/demo/service/contact/contact.service';
import { RoleService } from 'src/app/demo/service/role/role.service';

@Component({
  selector: 'app-contact-new',
  standalone: false,
  // imports: [],
  templateUrl: './contact-new.component.html',
  styleUrl: './contact-new.component.scss'
})
export class ContactNewComponent implements OnInit {
  countries: any[] = [];
  submitted: boolean = false;
  contact: Contact = new Contact();
  roles: Role[] = [];

     constructor(
        private contactService: ContactService,
         private roleService: RoleService,
     ) { }

  ngOnInit() {
      this.countries = [
          {name: 'Australia', code: 'AU'},
          {name: 'Brazil', code: 'BR'},
          {name: 'China', code: 'CN'},
          {name: 'Egypt', code: 'EG'},
          {name: 'France', code: 'FR'},
          {name: 'Germany', code: 'DE'},
          {name: 'India', code: 'IN'},
          {name: 'Japan', code: 'JP'},
          {name: 'Spain', code: 'ES'},
          {name: 'United States', code: 'US'}
      ]; 
      this.getAllRoles()
  }

  /**************************
   * ROLE
   **************************/
   getAllRoles() : void {
    this.roleService.getRoles().subscribe({
       next: (response) => {
           this.roles = response
         }
       })
     }

    saveContact() {
      this.submitted = true;

      console.log(this.contact);
      
      if (!this.contact.nom || !this.contact.prenom || !this.contact.email) {
          console.error("Veuillez remplir les champs obligatoires.");
          return;
      }

      this.contactService.createContact(this.contact).subscribe(
          response => {
              console.log("Utilisateur créé avec succès", response);
              alert("Utilisateur créé avec succès !");
              this.contact = new Contact(); // Réinitialiser le formulaire
              this.submitted = false;
          },
          error => {
              console.error("Erreur lors de la création de l'utilisateur", error);
              alert("Erreur lors de la création de l'utilisateur.");
          }
      );
  }
}
