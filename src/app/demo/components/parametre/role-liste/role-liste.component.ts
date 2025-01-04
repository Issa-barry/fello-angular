import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Product } from '../../../api/product';
import { ProductService } from '../../../service/product.service'; 
import { Role } from 'src/app/demo/models/Role';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/demo/service/role/role.service';
import { AuthService } from 'src/app/demo/service/auth/auth.service';
import { PermissionService } from 'src/app/demo/service/permission/permission.service';
import { ContactService } from 'src/app/demo/service/contact/contact.service';


@Component({
  selector: 'app-role-liste',
  standalone: false,
  // imports: [],
  templateUrl: './role-liste.component.html',
  styleUrl: './role-liste.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class RoleListeComponent implements OnInit {
  
  isAdmin: boolean = false;
  canEdit: boolean = false;
  loading: boolean = true;
  roles : Role[] = [];
  role: Role = new Role();
  optionPays: any[] = [];
  roleDialog: boolean = false;  
  deleteRoleDialog: boolean = false;
  deleteRolesDialog: boolean = false;
  submitted: boolean = false;
  cols: any[] = [];
  statuses: any[] = [];

  userAuthenticated : any = {};
  userAuthenticatedRole : any = {};
  userAuthenticatedRoleID : number = 0;
  
  rowsPerPageOptions = [5, 10, 20];
 

  selectedRoles: Product[] = [];
  products: Product[] = [];

  product: Product = {};

  permissions: any[] = [];
  permission: any = {};
  rolePermissions: any = {};

  constructor(
    private router : Router,
    private contactService: ContactService,
    private authService: AuthService,
    private roleService: RoleService,
    private productService: ProductService, 
    private messageService: MessageService, 
    private permissionService: PermissionService,
    private confirmationService: ConfirmationService) 
    { }

   
  ngOnInit() {
        this.optionPays = [
          { label: 'GUINEE-CONAKRY', value: 'Guinée-Conakry' },
          { label: 'FRANCE', value: 'France' },
      ];
      
      this.getAllRoles(); 
      this.getAutenticatedContact(); 
  }
 
     
//   canEdit(): boolean {
   
//     return false;
//     // return this.role.includes('modifier devises');
//   }
/******************************************************
 *   USERS
 ******************************************************/ 
getAutenticatedContact(): void {
    const id = Number(this.authService.getUserId());
    this.contactService.getContactById(id).subscribe({
      next: (response) => {
        this.userAuthenticated = response;  
        this.userAuthenticatedRole = this.userAuthenticated.data.roles;
        // console.log('User Authenticated:', this.userAuthenticated.data);
        // console.log('User Authenticated Role:', this.userAuthenticatedRole[0]);
        this.getRolePermissionsById(this.userAuthenticatedRole[0].id);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du USER:', err);
      }
    });
  }

 

/******************************************************
 *   PERMISSIONS
 ******************************************************/ 
 

getRolePermissionsById(id: number): void {
    this.permissionService.getRolePermissions(id).subscribe({
        next: (response) => {
            this.rolePermissions = response; 
            console.log("permissions du rôle:", this.rolePermissions);
            this.canEdit = this.rolePermissions.some((permission: any) => permission.name === 'modifier Roles');
            console.log('Can Edit:', this.canEdit);
        },
        error: (err) => {
            console.error(
                'Erreur lors de la récupération des permissions:',
                err
            );
        },
    });
}



/******************************************************
 *   ROLE
 ******************************************************/ 
  getAllRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.roles = response;   
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des roles:', err);
      }
    });
  }


  saveRole() {
    this.submitted = true;

    if (this.role.id) { // Modification
         
      this.roleService.updateRole(this.role.id, this.role).subscribe({
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
        this.roleService.createRole(this.role).subscribe({
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
 

/******************************************************
 *   UTILS
 ******************************************************/ 
 
  openNew() {
      this.role = new Role();
      this.submitted = false;
      this.roleDialog = true;
  }

  
  hideDialog() {
    this.roleDialog = false;
    this.submitted = false;
}

  deleteSelectedRoles() {
      this.deleteRolesDialog = true;
  }



  editRole(role: Role) {
    if(!this.canEdit){
        this.messageService.add({
            severity: 'error',
            summary: 'Accès refusé',
            detail: 'Vous n\'avez pas la permission pour modifier les rôles.',
            life: 3000,
          });
          return;
    }
  
    this.role = { ...role };
    this.roleDialog = true;
 }

  deleteRole(role: Role) {
      this.deleteRoleDialog = true;
      this.role = { ...role };
  }

  confirmDeleteSelected() {
      this.deleteRolesDialog = false;
      this.products = this.products.filter(val => !this.selectedRoles.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Role Deleted', life: 3000 });
      this.selectedRoles = [];
  }

 

confirmDelete( ) { 
  this.deleteRoleDialog = false;
  if (this.role.id !== undefined) { // Vérification que l'ID est défini
      this.roleService.deleteRole(this.role.id).subscribe({
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
      this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de supprimer l\'role : ID non défini.',
          life: 3000
      });
  }
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
