import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Product } from '../../../api/product';
import { ProductService } from '../../../service/product.service'; 
import { Role } from 'src/app/demo/models/Role';
 import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/demo/models/Permission';
import { PermissionService } from 'src/app/demo/service/permission/permission.service';
import { RoleService } from 'src/app/demo/service/role/role.service';


@Component({
  selector: 'app-role-detail',
  standalone: false,
  // imports: [],
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class RoleDetailComponent implements OnInit {

  roleId: number = this.activatedRoute.snapshot.params['id'];
  submitted: boolean = false;
  rowsPerPageOptions = [5, 10, 20];

  role: Role = new Role();    
  
  permissions: any[] = [];  
  permission: any = {};
  selectedPermissions: Permission[] = []; 

  rolePermissions: any = {};  
  permissionToRevoke: Permission = new Permission();  
 
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private productService: ProductService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService) 
    { }

  ngOnInit() {
        this.getAllPermissions();
        this.getRoleById(this.roleId);
        this.getRolePermissionsById(this.roleId);
  }
/**************************************************** *
* PERMISSIONS
/*********************************** */

saveSelectedPermissions(): void {
  // console.log('Permissions sélectionnées:', this.selectedPermissions);
   this.revokeNonSelectedPermissions();
   this.assignManyPermissionToRole(this.roleId)
}

  getDataNonSelected(): void {
    const dataNonSelected = this.rolePermissions.role.permissions.filter(
      (permission: Permission) =>
        !this.selectedPermissions.some(selected => selected.id === permission.id)
    );
    console.log("Données non sélectionnées :", dataNonSelected);
  }
  
  // revokeRolePermission(id:number): void {
  //   // let dataToRevoke = 
  //   //   {
  //   //     "permission": permission 
  //   // }

  // //   this.permissionService.revokeRolePermissions(id, dataToRevoke).subscribe({
  // //     next: () => {
  // //          console.log("permission revoké");  
  // //          this.getAllPermissions(); 
  // //     },
  // //     error: (err) => {
  // //         console.error('Erreur lors de la révocation de la permission:', err);
  // //         this.messageService.add({
  // //             severity: 'error',
  // //             summary: 'Erreur',
  // //             detail: 'La révocation de permission a échouée',
  // //             life: 3000
  // //         });
  // //     }
  // //  });
  // }

  revokeNonSelectedPermissions(): void {
    // Filtrer les permissions non sélectionnées
    const dataNonSelected = this.rolePermissions.role.permissions.filter(
      (permission: Permission) =>
        !this.selectedPermissions.some(selected => selected.id === permission.id)
    );
  
    console.log("Données non sélectionnées :", dataNonSelected);
  
    // Révoquer chaque permission
    dataNonSelected.forEach((permission: Permission) => {
      const dataToRevoke = { permission: permission.name };
  
      this.permissionService.revokeRolePermissions(this.roleId, dataToRevoke).subscribe({
        next: () => {
          console.log(`Permission révoquée : ${permission.name}`);
        },
        error: (err) => {
          console.error(`Erreur lors de la révocation de la permission ${permission.name}:`, err);
        }
      });
    });
  }
  
  assignManyPermissionToRole(id:number): void {
    let dataToAssigne = {
      permissions: this.selectedPermissions.map(permission => permission.name)
    };

    console.log('Permissions a assigner:', this.selectedPermissions);
    
    this.permissionService.assigneRolePermissions(id, dataToAssigne).subscribe({
      next: () => {
         this.getAllPermissions();  
      },
      error: (err) => {
          console.error('Erreur lors de l\'assignation de la permission:', err);
          this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Assignation de role a échouée',
              life: 3000
          });
      }
    });
  }

  getRolePermissionsById(id: number): void {
    this.permissionService.getRolePermissions(id).subscribe({
      next: (response) => {
        this.rolePermissions = response;  
        //  console.log("permission du role :", this.rolePermissions.role.permissions); 
         this.selectedPermissions = [...this.rolePermissions.role.permissions];//pre selection des permission (celà sert a les cocher en IHM)
        },
      error: (err) => {
        console.error('Erreur lors de la récupération des permissions:', err);
      }
    });
  }

 

/**************************************************** *
* ROLE
/*********************************** */

    getRoleById(id: number): void {
      this.roleService.getRoleById(id).subscribe({
        next: (response) => {
          this.role = response;  
          // console.log("Le role :", this.role); 
          },
        error: (err) => {
          console.error('Erreur lors de la récupération des permissions:', err);
        }
      });
    }
  
  getAllPermissions(): void {
    this.permissionService.getPermissions().subscribe({
      next: (response) => {
        this.permissions = response;  
       },
      error: (err) => {
        console.error('Erreur lors de la récupération des permissions:', err);
      }
    });
  }



  
  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  onGoToRoleListe(){
    this.router.navigate(['/dashboard/parametre/role-liste'])
  }



}
