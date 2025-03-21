import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Product } from '../../../api/product';
import { ProductService } from '../../../service/product.service'; 
import { Contact } from '../../../models/contact';
import { ContactService } from '../../../service/contact/contact.service';
import { RoleService } from '../../../service/role/role.service';
import { Role } from '../../../models/Role';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-liste',
  standalone: false,
  // imports: [],
  templateUrl: './contact-liste.component.html',
  styleUrl: './contact-liste.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class ContactListeComponent implements OnInit {
  
    contacts : Contact[] = [];
    contact: Contact = new Contact();
    roles: Role[] = [];
    optionPays: any[] = [];
    contactDialog: boolean = false;   
    deleteContactDialog: boolean = false;
    deleteContactsDialog: boolean = false;
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = []; 
    loading = false;
     
    rowsPerPageOptions = [5, 10, 20];
    // selectedContacts: Contact[] = [];
   
  
    selectedContacts: Product[] = [];
    products: Product[] = [];
  
    product: Product = {};
  
    constructor(
      private contactService: ContactService,
      private productService: ProductService, 
      
      private roleService: RoleService,
      private router: Router,
      private messageService: MessageService, 
      private confirmationService: ConfirmationService) 
      { }
  
  
    ngOnInit() {
          this.getAllContacts();
          this.getAllRoles()
          
          this.optionPays = [
            { label: 'GUINEE-CONAKRY', value: 'Guinée-Conakry' },
            { label: 'FRANCE', value: 'France' },
        ];
  
        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }
    
    getAllRoles() : void {
   this.roleService.getRoles().subscribe({
      next: (response) => {
          this.roles = response
          console.log(this.roles);
          
        }
      })
    }
  
    getAllContacts(): void {
        this.loading = true;
      this.contactService.getContacts().subscribe({
        next: (response) => {
          this.contacts = response;  
          this.loading = false; 
          // console.log(this.contacts);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des contacts:', err);
        }
      });
    }
  
    isValidPhone: boolean = true;

    validatePhone() {
      if (this.contact.phone) {
          // Regex acceptant :
          // - Numéro local : "622000000" (8 chiffres minimum)
          // - Numéro international avec + : "+225 07 12 34 56" (indicatif suivi d'au moins 8 chiffres)
          // - Numéro international avec 00 : "00225 07 12 34 56" (même règle que +)
          const phoneRegex = /^(?:\+|00)?(\d{1,3})[-.\s]?\d{10,}$/;
          this.isValidPhone = phoneRegex.test(this.contact.phone);
      } else {
          this.isValidPhone = false;
      }
  }
  
  
  isValidCodePostal: boolean = true; 
  isCodePostalDisabled: boolean = false;
  
     validateCodePostal() {
      if (this.contact.adresse && this.contact.adresse.code_postal !== undefined) {
          const codePostalStr = String(this.contact.adresse.code_postal);
          this.isValidCodePostal = /^\d{5}$/.test(codePostalStr);
      } else {
          this.isValidCodePostal = false;
      }
  }
  
  isValidPays: boolean = true;
  validatePays() {
      this.isValidPays = !!this.contact.adresse.pays; 
  
      // Si le pays sélectionné est "Guinée-Conakry", fixer le code postal à "00000" et le rendre non modifiable
      if (this.contact.adresse.pays === "GUINEE-CONAKRY") {
          this.contact.adresse.code_postal = "00000";
          this.isCodePostalDisabled = true;
      } else {
          this.isCodePostalDisabled = false;
      }
  }
  
  
    saveContact() {
      this.submitted = true;
      this.validatePays();
      this.validateCodePostal();
      this.validatePhone();
  
     this.contact.role = String(this.contact.role.name);
     this.contact.adresse.code_postal = String(this.contact.adresse.code_postal);
      // console.log(this.contact.role.name);
  
      if (this.contact.id && this.contact.password) { // Modification
           
        this.contactService.updateContact(this.contact.id, this.contact).subscribe({
          next: () => {
              this.getAllContacts(); 
              this.messageService.add({
                  severity: 'success',
                  summary: 'Succès',
                  detail: 'Contact créée avec succès',
                  life: 3000
              });
          },
          error: (err) => {
              console.error('Erreur lors de la création de l\'contact:', err);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Erreur',
                  detail: 'Création de l\'contact échouée',
                  life: 3000
              });
          }
      });
      this.contactDialog = false;
  
      } else if  (this.contact.nom_complet)  { // Création
         
          console.log(this.contact.role);
          
          this.contactService.createContact(this.contact).subscribe({
              next: () => {
                   this.getAllContacts(); 
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Succès',
                      detail: 'Contact créée avec succès',
                      life: 3000
                  });
              },
              error: (err) => {
                  console.error('Erreur lors de la création de l\'contact:', err);
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Erreur',
                      detail: 'Création de l\'contact échouée',
                      life: 3000
                  });
              }
          });
          this.contactDialog = false;
      }
  }
    //Fin contact
  
  
    openNew() {
        this.product = {};
        this.submitted = false;
        this.contactDialog = true;
    }
  
    deleteSelectedContacts() {
        this.deleteContactsDialog = true;
    }
  
    editContact(contact: Contact) {
      this.contact = { ...contact };
      this.contactDialog = true;
  }
  
  // editContact(product: Product) {
  //   this.product = { ...product };
  //   this.contactDialog = true;
  // }
  
    deleteContact(contact: Contact) {
        this.deleteContactDialog = true;
        this.contact = { ...contact };
    }
  
    confirmDeleteSelected() {
        this.deleteContactsDialog = false;
        this.products = this.products.filter(val => !this.selectedContacts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedContacts = [];
    }
  
  //   confirmDelete() {
  //     this.deleteContactDialog = false;
  //     this.products = this.products.filter(val => val.id !== this.product.id);
  //     this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
  //     this.product = {};
  // }
  
  confirmDelete( ) { 
    this.deleteContactDialog = false;
      
    if (this.contact.id !== undefined) { // Vérification que l'ID est défini
        this.contactService.deleteContact(this.contact.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Contact supprimée avec succès',
                    life: 3000
                });
                this.getAllContacts(); // Rechargez la liste des contacts après suppression
            },
            error: (err) => {
                console.error('Erreur lors de la suppression de l\'contact:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'La suppression de l\'contact a échoué',
                    life: 3000
                });
            }
        });
    } else {
        console.error('Impossible de supprimer : ID d\'contact non défini.');
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer l\'contact : ID non défini.',
            life: 3000
        });
    }
  }
  
    hideDialog() {
        this.contactDialog = false;
        this.submitted = false;
    }
  
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onGotToNewContact() {
        this.router.navigate(['/dashboard/contact/contact-new']);
    }

    onGotToContactDetail(contact: Contact) {
        this.router.navigate(['/dashboard/contact/contact-detail', contact.id]);
    }
}
