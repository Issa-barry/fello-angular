import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AgenceService } from '../../service/agence.service';
import { Agence } from '../../models/agence';

 

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

  constructor(
    private agenceService: AgenceService,
    private productService: ProductService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService) { 
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


editAgence(agence: Agence) {
  this.agence = { ...agence };  // Copie de l'agence à éditer
  this.agenceDialog = true;
}

OpenEditAgence(agence: Agence) {
this.agence = { ...agence };  // Copie de l'agence à éditer
this.agenceDialog = true;
}

  ngOnInit() {
    this.getAllAgences(); 
      this.optionPays = [
          { label: 'GUINEE-CONAKRY', value: 'Guinée-Conakry' },
          { label: 'FRANCE', value: 'France' },
      ];
  }

  openNew() {
     this.agence = new Agence();
      this.submitted = false;
      this.agenceDialog = true;
  }

  deleteSelectedAgences() {
      this.deleteAgencesDialog = true;
  }


  deleteAgence(agence: Agence) {
      this.deleteAgenceDialog = true;
      this.agence = { ...agence };
  }

  confirmDeleteSelected() {
      this.deleteAgencesDialog = false;
      this.products = this.products.filter(val => !this.selectedProducts.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      this.selectedProducts = [];
  }

  confirmDelete() {
      this.deleteAgenceDialog = false;
      this.products = this.products.filter(val => val.id !== this.product.id);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      this.product = {};
  }

  hideDialog() {
      this.agenceDialog = false;
      this.submitted = false;
  }

    
  saveAgence() {
    this.submitted = true;

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
    } else { // Création
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


  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id) {
              index = i;
              break;
          }
      }

      return index;
  }

  createId(): string {
      let id = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
 