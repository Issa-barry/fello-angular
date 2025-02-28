import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Civilite } from 'src/app/demo/enums/civilite.enum';
import { Contact } from 'src/app/demo/models/contact';
import { Role } from 'src/app/demo/models/Role';
import { ContactService } from 'src/app/demo/service/contact/contact.service';
import { RoleService } from 'src/app/demo/service/role/role.service';

@Component({
  selector: 'app-contact-detail',
  standalone: false,
  // imports: [],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class ContactDetailComponent implements OnInit {
      countries: any[] = [];
       submitted: boolean = false;
      //  contact: Contact = new Contact();
       roles: Role[] = [];
       errors: { [key: string]: string } = {};
       @Input() contact: Contact = new Contact()
       @Input() role: Role = new Role()
      id:      number  = this.activatedRoute.snapshot.params['id'];
     
     
          constructor(
             private contactService: ContactService,
             private roleService: RoleService,
             private messageService: MessageService, 
             private confirmationService: ConfirmationService,
             private activatedRoute: ActivatedRoute,
             private router: Router,
          ) { }
     
       ngOnInit() {
           this.countries = [
               {name: 'GUINEE-CONAKRY', code: 'GN'},
               {name: 'France', code: 'FR'},
           ]; 
           this.getAllRoles();
           this.getRoleById(3);
           this.onGetContact();
       }
 
       onGetContact(): void {
        this.contactService.getContactById(this.id).subscribe({
            next: (resp) => {
                this.contact = resp;
    
                // 🔥 Assure que le rôle est bien sélectionné dans le dropdown
                if (this.roles.length > 0) {
                    this.contact.role = this.roles.find(role => role.id === resp.role.id) || null;
                }
    
                console.log('Contact récupéré:', this.contact);
            },
            error: (err) => {
                console.error('Erreur lors de la récupération du contact:', err);
            }
        });
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

          getRoleById(id:number): void{
            this.roleService.getRoleById(id).subscribe({
                next:(resp) => {
                  this.role = resp
                  console.log("Role", this.role); 
                 }
              })
          }
     
       //Civilité :  Convertir l'énumération en tableau d'options
       civiliteOptions = Object.values(Civilite).map(civ => ({ label: civ, value: civ }));
         
       saveContact() {
         this.submitted = true;
         this.errors = {}; // Réinitialisation des erreurs
     
         if (!this.contact.role 
             || !this.contact.civilite 
             || !this.contact.nom 
             || !this.contact.prenom 
             || !this.contact.email 
             || !this.contact.phone
             || !this.contact.password
             || !this.contact.password_confirmation
             || !this.contact.adresse
             || !this.contact.adresse.pays
             || !this.contact.adresse.ville
             || !this.contact.adresse.code_postal) {
             this.messageService.add({
                 severity: 'warn',
                 summary: 'Attention',
                 detail: 'Veuillez remplir tous les champs obligatoires.',
                 life: 3000
             });
             return;
         }
     
         this.contact.role = String(this.contact.role.name);
         this.contact.adresse.pays = String(this.contact.adresse.pays);
         this.contact.adresse.code_postal = String(this.contact.adresse.code_postal);
     
         this.contactService.createContact(this.contact).subscribe({
             next: () => { 
                 this.messageService.add({
                     severity: 'success',
                     summary: 'Succès',
                     detail: 'Contact créé avec succès',
                     life: 3000
                 });
     
                 this.contact = new Contact();
                 this.submitted = false;
                 this.errors = {}; // Réinitialisation des erreurs après succès
             },
             error: (err) => {
                 console.error(' Erreur lors de la création du contact:', err);
                 
                 if (err.error && err.error.errors) {
                     // Stocker les erreurs dans l'objet `errors`
                     this.errors = err.error.errors;
                 }
     
                 this.messageService.add({
                     severity: 'error',
                     summary: 'Erreur',
                     detail: 'Création du contact échouée. Vérifiez les champs.',
                     life: 5000
                 });
             }
         });
     }
     
}
   