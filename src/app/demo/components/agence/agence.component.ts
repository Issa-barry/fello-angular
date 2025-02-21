import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Agence } from '../../models/agence';
import { AgenceService } from '../../service/agence/agence.service';

 

@Component({
  selector: 'app-agence',
 
  templateUrl: './agence.component.html',
  styleUrl: './agence.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class AgenceComponent implements OnInit {
  
  products: Product[] = [];

  product: Product = {}; 

  selectedProducts: Product[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = []; 

  rowsPerPageOptions = [5, 10, 20];

  
  agences: Agence[] = [];
  selectedAgences: Agence[] = [];
  agence: Agence = new Agence();
  agenceDialog: boolean = false;
  optionPays: any[] = [];
  deleteAgenceDialog: boolean = false;
  deleteAgencesDialog: boolean = false;
  apiErrors: { [key: string]: string[] } = {};

  value1: any;

  value2: any;

  value3: any;

  value4: any;

  value5: any;

  value6: any;

  value7: any;

  value8: any;

  value9: any;

  value10: any;

  cities: any[];
  constructor(
    private agenceService: AgenceService,
    private productService: ProductService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService) { 
        this.cities = [
            { name: 'Guinée-Conacry', code: 'GN' },
            { name: 'France', code: 'FR' },
        ];
    }
    ngOnInit() {
      this.getAllAgences(); 
        this.optionPays = [
            { label: 'GUINEE-CONAKRY', value: 'Guinée-Conakry' },
            { label: 'FRANCE', value: 'France' },
        ];
    }

getAllAgences(): void {
  this.agenceService.getAgences().subscribe({
    next: (response) => {
      this.agences = response;  
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des agences:', err);
    }
  });
}

hideDialog() {
  this.agenceDialog = false;
  this.submitted = false;
}

openNew() {
   this.agence = new Agence();
   this.submitted = false;
   this.agenceDialog = true;
}

openEditAgence(agence: Agence) {
this.agence = { ...agence };  // Copie de l'agence à éditer
this.agenceDialog = true;
}


openDeleteAgence(agence: Agence) {
  this.agence = { ...agence };
  this.deleteAgenceDialog = true;
}

  deleteSelectedAgences() {
      this.deleteAgencesDialog = true;
  }

  confirmDeleteSelected() {
      this.deleteAgencesDialog = false;
      this.products = this.products.filter(val => !this.selectedProducts.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      this.selectedProducts = [];
  }

  confirmDelete( ) { 
    this.deleteAgenceDialog = false;
      
    if (this.agence.id !== undefined) { // Vérification que l'ID est défini
        this.agenceService.deleteAgence(this.agence.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Agence supprimée avec succès',
                    life: 3000
                });
                this.getAllAgences(); // Rechargez la liste des agences après suppression
            },
            error: (err) => {
                console.error('Erreur lors de la suppression de l\'agence:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'La suppression de l\'agence a échoué',
                    life: 3000
                });
            }
        });
    } else {
        console.error('Impossible de supprimer : ID d\'agence non défini.');
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer l\'agence : ID non défini.',
            life: 3000
        });
    }
}


isFormInvalid(): boolean {
  return (
      !this.agence.nom_agence ||
      !this.agence.phone ||
      !this.agence.email ||
      !this.agence.adresse ||
      !this.agence.adresse.adresse ||
      !this.agence.adresse.code_postal ||
      !this.agence.adresse.ville
  );
}
    
handleApiErrors(err: any): void {
  if (err.error && err.error.errors) {
      this.apiErrors = err.error.errors; // Associer les erreurs aux champs
      Object.keys(err.error.errors).forEach((key) => {
          const errorMessages = err.error.errors[key];
          this.messageService.add({
              severity: 'error',
              summary: `Erreur sur le champ ${key}`,
              detail: errorMessages.join(', '),
              life: 5000
          });
      });
  } else {
      this.apiErrors = {}; // Réinitialiser
      this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur inattendue s\'est produite.',
          life: 5000
      });
  }
}

isValidPays: boolean = true;
validatePays() {
    this.isValidPays = !!this.agence.adresse.pays; // Vérifie si le pays est défini
}

isValidCodePostal: boolean = true; 
   validateCodePostal() {
    if (this.agence.adresse && this.agence.adresse.code_postal !== undefined) {
        const codePostalStr = String(this.agence.adresse.code_postal);
        this.isValidCodePostal = /^\d{5}$/.test(codePostalStr);
    } else {
        this.isValidCodePostal = false;
    }
}

  saveAgence() {
    this.submitted = true;
    this.validatePays();
        const codePostalStr = String(this.agence.adresse.code_postal);
        if (!this.isValidCodePostal) {
            return; 
        }

        if (this.agence.adresse && this.agence.adresse.code_postal !== undefined) {
            this.agence.adresse.code_postal = String(this.agence.adresse.code_postal);
        }

    if (this.agence.id) { // Modification
   
        this.agenceService.updateAgence(this.agence.id, this.agence).subscribe({
            next: () => {
                this.getAllAgences(); 
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Agence modifiée avec succès',
                    life: 3000
                });
            },
            error: (err) => {
                console.error('Erreur lors de la modification de l\'agence:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Modification de l\'agence échouée',
                    life: 3000
                });
            }
        });
        this.agenceDialog = false;
        
    } else if(this.agence.nom_agence && this.agence.phone && this.agence.email && this.agence.adresse.ville) { // Création
      
        this.agenceService.createAgence(this.agence).subscribe({
            next: () => {
                 this.getAllAgences(); 
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Agence créée avec succès',
                    life: 3000
                });
            },
            error: (err) => {
                console.error('Erreur lors de la création de l\'agence:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Création de l\'agence échouée',
                    life: 3000
                });
            }
        });
        this.agenceDialog = false;
    }
}

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
 