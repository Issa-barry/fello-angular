import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TransfertService } from 'src/app/demo/service/transfert/transfert.service';
import { Transfert } from 'src/app/demo/models/transfert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfert-liste',
  templateUrl: './transfert-liste.component.html', 
  styleUrl: './transfert-liste.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class TransfertListeComponent implements OnInit {
  transferts: Transfert[] = [];
  transfert: Transfert = new Transfert();
  transfertDialog: boolean = false; 
  deleteTransfertDialog: boolean = false;
  deleteTransfertsDialog: boolean = false;

  //
  products: Product[] = [];

  product: Product = {};

  selectedTransferts: Product[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private router: Router,
    private transfertService: TransfertService,
    private productService: ProductService, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
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

      /******* TRANSFERT API */
      this.getAllTransferts();
  }
  goToTransfertEnvoie() {
    this.router.navigate(['/dashboard/transfert/envoie']);
  }

  goToTransfertRetrait() {
    this.router.navigate(['/dashboard/transfert/retrait']);
  }

  goToTransfertDetail(transfert: Transfert) {    
    this.router.navigate(['/dashboard/transfert/detail', transfert.id]);  
  }
  
  getAllTransferts(): void {
    this.transfertService.getTransferts().subscribe({
      next: (response) => {
        this.transferts = response;   
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des transferts:', err);
      }
    });
  }

  openNew() {
      this.product = {};
      this.submitted = false;
      this.transfertDialog = true;
  }

  deleteSelectedTransferts() {
      this.deleteTransfertsDialog = true;
  }

  editProduct(product: Product) {
      this.product = { ...product };
      this.transfertDialog = true;
  }



  confirmDeleteSelected() { 
      this.deleteTransfertsDialog = false;
      this.products = this.products.filter(val => !this.selectedTransferts.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      this.selectedTransferts = [];
  }

  // confirmDelete() {
  //     this.deleteTransfertDialog = false;
  //      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Transfert Deleted', life: 3000 });
  //     this.transfert = new Transfert();
  // }

  
confirmDelete( ) { 
  this.deleteTransfertDialog = false;
  if (this.transfert.id !== undefined) { // Vérification que l'ID est défini
      this.transfertService.annulerTransfert(this.transfert.id).subscribe({
          next: () => {this.messageService.add({severity: 'success',summary: 'Succès', detail: 'Transfert supprimée avec succès',life: 3000});
              this.getAllTransferts(); 
          },
          error: (err) => {
              console.error('Erreur lors de la suppression de l\'transfert:', err);
              this.messageService.add({severity: 'error',summary: 'Erreur',detail: 'La suppression de l\'transfert a échoué',life: 3000});
          }
      });
  } else {
      console.error('Impossible de supprimer : ID d\'transfert non défini.');
      this.messageService.add({severity: 'error',summary: 'Erreur',detail: 'Impossible de supprimer l\'transfert : ID non défini.',life: 3000});
  }
}
 
  hideDialog() {
      this.transfertDialog = false;
      this.submitted = false;
  }

  saveProduct() {
      this.submitted = true; 
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


//   deleteTransfert(transfert: Transfert) {
//     // this.deleteTransfertDialog = true;
//     this.transfert = { ...transfert };
  
// }

  confirmDeleteTransfert(transfert: Transfert): void {
    this.confirmationService.confirm({
        message: "Êtes-vous sûr de vouloir supprimer ce transfert ? Cette action est irréversible.",
        header: "Confirmation-by dialog",
        icon: "pi pi-exclamation-triangle",
        acceptButtonStyleClass: "p-button-danger",
      rejectButtonStyleClass: "p-button-secondary",
        acceptLabel: "Oui",
        rejectLabel: "Non",
        accept: () => this.deleteTransfert(transfert),
        reject: () => {
            this.messageService.add({
                severity: 'info',
                summary: 'Annulation',
                detail: 'La suppression a été annulée.',
            });
        }
    });
  }


   /** 🔹 Supprimer un transfert par ID ou par Code */
   deleteTransfert(transfert: Transfert): void {
    if (transfert.code) {
        this.transfertService.deleteTransfertByCode(transfert.code).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Transfert supprimé avec succès.',
                    life: 4500,
                });
                this.getAllTransferts(); // ✅ Mise à jour de la liste
            },
            error: (err) => {
                console.error("Erreur lors de la suppression :", err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: err.message || "Échec de la suppression.",
                });
            }
        });
    } else {
        this.transfertService.deleteTransfertById(transfert.id as number).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Transfert supprimé avec succès.',
                    life: 4500,
                });
                this.getAllTransferts(); // ✅ Mise à jour de la liste
            },
            error: (err) => {
                console.error("Erreur lors de la suppression :", err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: err.message || "Échec de la suppression.",
                });
            }
        });
    }
}

}
 