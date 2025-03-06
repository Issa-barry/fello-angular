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
       isGuineeSelected: boolean = false;
       villeAvantSelection : string = '';
       paysAvantSelection : string = '';
     
     
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
        console.log('this.contact.adresse.pays: pays actuelle', this.contact.adresse.pays);

        console.log(' pays selectionner', selectedCountry);

        console.log('ville avant selection dans onChange:', this.villeAvantSelection);
        console.log('pays avant selection:', this.paysAvantSelection);

        

        if (selectedCountry && selectedCountry === 'GUINEE-CONAKRY') { 
            this.isGuineeSelected = true;
            this.contact.adresse.adresse = 'GUINEE-CONAKRY';
            this.contact.adresse.code_postal = '00224'; 
            this.contact.adresse.ville = this.villeAvantSelection;
            if(this.paysAvantSelection !== 'GUINEE-CONAKRY'){
                this.contact.adresse.ville = '';
            }

        } else { 
            this.isGuineeSelected = false; 
            this.contact.adresse.adresse = '';
            this.contact.adresse.ville = '';
            this.contact.adresse.quartier = '';
            this.contact.adresse.code_postal = ''; 
        }

        // this.contactService.getContactById(this.id).subscribe({
        //     next: (resp) => {
        //         this.contact = resp;
        //         this.isGuineeSelected = this.contact.adresse.pays === 'GUINEE-CONAKRY';

        //         // console.log('this.contact.adresse.pays: pays actuelle', this.contact.adresse.pays);

        //         // console.log(' pays selectionner', selectedCountry);
                
        //         if (selectedCountry && selectedCountry === 'GUINEE-CONAKRY' && this.contact.adresse.pays === 'GUINEE-CONAKRY') { 
        //             // this.isGuineeSelected = true;
        //             // this.contact.adresse.adresse = 'GUINEE-CONAKRY';
        //             // this.contact.adresse.code_postal = '00224'; 
        //         } else if (selectedCountry && selectedCountry === 'GUINEE-CONAKRY' && this.contact.adresse.pays === 'France') { 
        //             // this.isGuineeSelected = true;
        //             // this.contact.adresse.adresse = 'GUINEE-CONAKRY';
        //             // this.contact.adresse.code_postal = '00224'; 
        //             console.log('pays selectionner', selectedCountry);
        //             console.log('pays contct', this.contact.adresse.pays);
                    
        //         }
        //     },
        //     error: (err) => {
        //         console.error('Erreur lors de la récupération du contact:', err);
        //     }
        // });
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
                // console.log('pays avant selection:', this.paysAvantSelection);
                
                // ✅ Vérification avant d'appeler getRoleById()
                if (this.contact.role_id !== undefined && this.contact.role_id !== null) {
                    this.getRoleById(this.contact.role_id);
                    if (this.contact.adresse && this.contact.adresse.pays && this.countries.length > 0) {
                        const selectedCountry = this.countries.find(c => c.name === this.contact.adresse.pays);
                        this.contact.adresse.pays = selectedCountry || null;
                    }
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
     
         this.contactService.updateContact(this.id, this.contact).subscribe({
             next: () => { 
                 this.messageService.add({
                     severity: 'success',
                     summary: 'Succès',
                     detail: 'Les données du contact on été maj avec succès',
                     life: 3000
                 });
     
                 
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
   