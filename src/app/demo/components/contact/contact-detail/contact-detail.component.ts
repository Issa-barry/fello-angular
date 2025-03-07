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
       roles: Role[] = [];
       errors: { [key: string]: string } = {};  
       @Input() contact: Contact = new Contact()
       @Input() role: Role = new Role()
       id:      number  = this.activatedRoute.snapshot.params['id'];
       isGuineeSelected: boolean = false;
       paysAChanger: boolean = false;
       villeAvantSelection : string = '';
       paysAvantSelection : string = '';
       codePostalAvantSelection : string = '';
       adresseAvantSelection : string = '';
       quartierAvantSelection : string = '';
     
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
            { name: 'GUINEE-CONAKRY', code: 'GN', value: 'GUINEE-CONAKRY' },
            { name: 'France', code: 'FR', value: 'FRANCE' },
        ];
           this.getAllRoles();
           this.onGetContact();
       }

   
    onCountryChange(event: any) {
        const selectedCountry = event.value;
        this.paysAChanger = true;

        if (selectedCountry && selectedCountry === 'GUINEE-CONAKRY') { 
            this.contact.adresse.pays = selectedCountry;
            this.isGuineeSelected = true;
            if(this.paysAvantSelection === 'GUINEE-CONAKRY') {
                this.contact.adresse.adresse = 'GUINEE-CONAKRY';
                this.contact.adresse.code_postal = '00224'; 
                this.contact.adresse.ville = this.villeAvantSelection;
                this.contact.adresse.quartier = this.quartierAvantSelection;
                this.contact.adresse.pays = selectedCountry;
            }else{
                this.contact.adresse.adresse = 'GUINEE-CONAKRY';
                this.contact.adresse.code_postal = '00224'; 
                this.contact.adresse.ville = '';
            }
            
        } else { 
            this.isGuineeSelected = false; 
            if(this.paysAvantSelection === 'France') {
            this.contact.adresse.ville = this.villeAvantSelection;
            this.contact.adresse.code_postal = this.codePostalAvantSelection;
            this.contact.adresse.adresse = this.adresseAvantSelection;
            this.contact.adresse.pays = selectedCountry;
            
            }else{
                this.contact.adresse.adresse = '';
                this.contact.adresse.code_postal = ''; 
                this.contact.adresse.ville = '';
                this.contact.adresse.quartier = '';
            }
        }
    }
    
    
       /**************************
        * ROLE
        **************************/
       getAllRoles(): void {
        this.roleService.getRoles().subscribe({
            next: (response) => {
                this.roles = response;
    
                // ✅ Si le contact est déjà récupéré, mettre à jour son rôle dans le dropdown
                if (this.contact && this.contact.role) {
                    this.contact.role = this.roles.find(role => role.id === this.contact.role.id) || null;
                }
            }
        });
    }

    getRoleById(id: number): void {
        this.roleService.getRoleById(id).subscribe({
            next: (resp) => {
                this.role = resp;
                this.contact.role = resp.name; // ✅ Assigne directement le rôle au contact
            },
            error: (err) => {
                console.error('Erreur lors de la récupération du rôle:', err);
            }
        });
    }
     

    onGetContact(): void {
        this.contactService.getContactById(this.id).subscribe({
            next: (resp) => {
                this.contact = resp;
    
                this.isGuineeSelected = this.contact.adresse.pays === 'GUINEE-CONAKRY';
                this.villeAvantSelection = this.contact.adresse.ville;
                this.paysAvantSelection = this.contact.adresse.pays;
                this.codePostalAvantSelection = this.contact.adresse.code_postal;
                this.adresseAvantSelection = this.contact.adresse.adresse;
                this.quartierAvantSelection = this.contact.adresse.quartier;
 
                // Vérification et récupération du rôle
                if (this.contact.role_id !== undefined && this.contact.role_id !== null) {
                    this.getRoleById(this.contact.role_id);
                } else {
                    console.warn("Le contact n'a pas de rôle attribué.");
                    this.contact.role = null;
                }
            },
            error: (err) => {
                console.error('Erreur lors de la récupération du contact:', err);
            }
        });
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

        const selectedRole = this.roles.find(r => r.name === this.contact.role);
        const selectedRoleId = this.roles.find(r => r.name === this.contact.role);
 
        this.contact.adresse.pays = String(this.contact.adresse.pays);
        this.contact.adresse.adresse = String(this.contact.adresse.adresse);
        this.contact.adresse.code_postal = String(this.contact.adresse.code_postal);
        this.contact.roles = selectedRole;
         
         this.contactService.updateContact(this.id, this.contact).subscribe({
             next: (resp) => { 

                this.contact = resp;
                 this.messageService.add({
                     severity: 'success',
                     summary: 'Succès',
                     detail: 'Les données du contact on été maj avec succès',
                     life: 3000
                 });
 
                 this.submitted = false;
                 this.errors = {}; 
                 this.onGetContact();
             },
             error: (err) => {
                 console.error(' Erreur lors de la création du contact:', err);
                 
                 if (err.error && err.error.errors) {
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
   