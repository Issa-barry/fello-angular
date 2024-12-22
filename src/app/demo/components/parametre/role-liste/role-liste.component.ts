import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Product } from '../../../api/product';
import { ProductService } from '../../../service/product.service'; 
import { Role } from 'src/app/demo/models/Role';
import { RolePermissionService } from 'src/app/demo/service/rolePermission/role-permission.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-role-liste',
  standalone: false,
  // imports: [],
  templateUrl: './role-liste.component.html',
  styleUrl: './role-liste.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class RoleListeComponent implements OnInit {
  
  roles : Role[] = [];
  role: Role = new Role();
  optionPays: any[] = [];
  roleDialog: boolean = false;  
  deleteRoleDialog: boolean = false;
  deleteRolesDialog: boolean = false;
  submitted: boolean = false;
  cols: any[] = [];
  statuses: any[] = [];
  
 

  rowsPerPageOptions = [5, 10, 20];
  // selectedRoles: Role[] = [];
 

  selectedRoles: Product[] = [];
  products: Product[] = [];

  product: Product = {};

  constructor(
    private router : Router,
    private rolePermissionService: RolePermissionService,
    private productService: ProductService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService) 
    { }


  
  ngOnInit() {
        this.getAllRoles();
        
        this.optionPays = [
          { label: 'GUINEE-CONAKRY', value: 'Guinée-Conakry' },
          { label: 'FRANCE', value: 'France' },
      ];

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
  }

  getAllRoles(): void {
    this.rolePermissionService.getRoles().subscribe({
      next: (response) => {
        this.roles = response;   
        console.log("Roles :", this.roles);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des roles:', err);
      }
    });
  }



  saveRole() {
    this.submitted = true;

    if (this.role.id) { // Modification
         
      this.rolePermissionService.updateRole(this.role.id, this.role).subscribe({
        next: () => {
             this.getAllRoles(); 
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Role modifié avec succès',
                life: 3000
            });
        },
        error: (err) => {
            console.error('Erreur lors de la création de l\'role:', err);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Modification de l\'role échouée',
                life: 3000
            });
        }
    });
    this.roleDialog = false;

    } else { // Création 
        this.rolePermissionService.createRole(this.role).subscribe({
            next: () => {
                this.getAllRoles(); 
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Role créée avec succès',
                    life: 3000
                });
            },
            error: (err) => {
                console.error('Erreur lors de la création de l\'role:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Création de l\'role échouée',
                    life: 3000
                });
            }
        });
        this.roleDialog = false; 
    }
}
  //Fin role


  openNew() {
      this.product = {};
      this.submitted = false;
      this.roleDialog = true;
  }

  deleteSelectedRoles() {
      this.deleteRolesDialog = true;
  }

  editRole(role: Role) {
    this.role = { ...role };
    this.roleDialog = true;
}

// editRole(product: Product) {
//   this.product = { ...product };
//   this.roleDialog = true;
// }

  deleteRole(role: Role) {
      this.deleteRoleDialog = true;
      this.role = { ...role };
  }

  confirmDeleteSelected() {
      this.deleteRolesDialog = false;
      this.products = this.products.filter(val => !this.selectedRoles.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      this.selectedRoles = [];
  }

 

confirmDelete( ) { 
  this.deleteRoleDialog = false;
  
  if (this.role.id !== undefined) { // Vérification que l'ID est défini
      this.rolePermissionService.deleteRole(this.role.id).subscribe({
          next: () => {
              this.messageService.add({
                  severity: 'success',
                  summary: 'Succès',
                  detail: 'Role supprimée avec succès',
                  life: 3000
              });
              this.getAllRoles(); // Rechargez la liste des roles après suppression
          },
          error: (err) => {
              console.error('Erreur lors de la suppression de l\'role:', err);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Erreur',
                  detail: 'La suppression de l\'role a échoué',
                  life: 3000
              });
          }
      });
  } else {
      console.error('Impossible de supprimer : ID d\'role non défini.');
      this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de supprimer l\'role : ID non défini.',
          life: 3000
      });
  }
}

  hideDialog() {
      this.roleDialog = false;
      this.submitted = false;
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

  onGoToDetail(id : number){
     this.router.navigate(['/dashboard/parametre/role-detail', id])
  }
}
