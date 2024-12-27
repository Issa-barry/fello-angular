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
  selectedPermissions: any[] = []; 

  rolePermissions: any = {};  
 
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
  getRolePermissionsById(id: number): void {
    this.permissionService.getRolePermissions(id).subscribe({
      next: (response) => {
        this.rolePermissions = response;  
         console.log("permission du role :", this.rolePermissions.role.permissions); 
         this.selectedPermissions = [...this.rolePermissions.role.permissions];
        },
      error: (err) => {
        console.error('Erreur lors de la récupération des permissions:', err);
      }
    });
  }

  // isPermissionSelected(permission: { id: number }): boolean {
  //   return this.rolePermissions?.role?.permissions?.some((p: { id: number }) => p.id === permission.id);
  // }
  

  
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

  saveSelectedPermissions(): void {
    console.log('Permissions sélectionnées:', this.selectedPermissions);
  }


}
