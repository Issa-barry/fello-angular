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
  productDialog: boolean = false;

  deleteProductDialog: boolean = false;

  deleteProductsDialog: boolean = false;

  products: Product[] = [];

  product: Product = {};

  selectedProducts: Product[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  
  agences: Agence[] = [];
  agence: Agence = new Agence();
  agenceDialog: boolean = false;
  optionPays: any[] = [];

  constructor(
    private agenceService: AgenceService,
    private productService: ProductService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService) { 
    }

    getAllAgences(): void {
        this.agenceService.getAgences().subscribe({
          next: (response) => {
            this.agences = response;  // La réponse contient déjà l'adresse
            console.log('Agences avec adresse:', this.agences);
      
            // Exemple d'accès à l'adresse
            this.agences.forEach(agence => {
              if (agence.adresse) {
                console.log(`Adresse de ${agence.nom_agence}:`, agence.adresse);
              } else {
                console.warn(`Pas d'adresse pour l'agence: ${agence.nom_agence}`);
              }
            });
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des agences:', err);
          }
        });
      }
      

      
  editAgence(agence: Agence) {
    
      this.agence = { ...agence };  // Copie de l'agence à éditer
      this.agenceDialog = true;
      
      console.log("agence dialoé", agence);
    
  }
  

  ngOnInit() {
    this.getAllAgences(); 
      this.productService.getProducts().then(data => this.products = data);
 
  
      this.cols = [
          { field: 'product', header: 'Product' },
          { field: 'price', header: 'Price' },
          { field: 'category', header: 'Category' },
          { field: 'rating', header: 'Reviews' },
          { field: 'inventoryStatus', header: 'Status' }
      ];

      this.statuses = [
        { label: 'INSTOCK', value: 'instock' },
        { label: 'LOWSTOCK', value: 'lowstock' },
        { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];

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

  deleteSelectedProducts() {
      this.deleteProductsDialog = true;
  }


  editProduct(product: Product) {
      this.product = { ...product };
      this.agenceDialog = true;
  }

  deleteProduct(product: Product) {
      this.deleteProductDialog = true;
      this.product = { ...product };
  }

  confirmDeleteSelected() {
      this.deleteProductsDialog = false;
      this.products = this.products.filter(val => !this.selectedProducts.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      this.selectedProducts = [];
  }

  confirmDelete() {
      this.deleteProductDialog = false;
      this.products = this.products.filter(val => val.id !== this.product.id);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      this.product = {};
  }

  hideDialog() {
      this.agenceDialog = false;
      this.submitted = false;
  }

  saveProduct() {
      this.submitted = true;

      if (this.product.name?.trim()) {
          if (this.product.id) {
              // @ts-ignore
              this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
              this.products[this.findIndexById(this.product.id)] = this.product;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
          } else {
              this.product.id = this.createId();
              this.product.code = this.createId();
              this.product.image = 'product-placeholder.svg';
              // @ts-ignore
              this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
              this.products.push(this.product);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
          }

          this.products = [...this.products];
          this.productDialog = false;
          this.product = {};
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
 