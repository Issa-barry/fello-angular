import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { PermissionService } from 'src/app/demo/service/permission/permission.service'; // Service pour les permissions
import { AuthService } from 'src/app/demo/service/auth/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    canViewRole: boolean = false;
    canViewDashboardCa: boolean = false;
    canViewDashboardRh: boolean = false;
    canViewTransfert: boolean = false;
    canViewFactures: boolean = false;
    canViewContact: boolean = false;
    canViewAgence: boolean = false;

    constructor(
        private permissionService: PermissionService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        // Récupérer les permissions de l'utilisateur authentifié
        const userId = this.authService.getUserId();
        if (userId) {
            this.permissionService.getRolePermissions(Number(userId)).subscribe({
                next: (permissions) => {
                    // Vérifiez les permissions spécifiques
                    this.canViewRole = permissions.some(
                        (permission: any) => permission.name === 'afficher Roles'
                    );
                    this.canViewDashboardCa = permissions.some(
                        (permission: any) => permission.name === 'afficher Dashboard-CA'
                    );
                    this.canViewDashboardRh = permissions.some(
                        (permission: any) => permission.name === 'afficher Dashboard-RH'
                    );
                    this.canViewTransfert = permissions.some(
                        (permission: any) => permission.name === 'afficher Transfert'
                    );
                    this.canViewFactures = permissions.some(
                        (permission: any) => permission.name === 'afficher Factures'
                    );
                    this.canViewContact = permissions.some(
                        (permission: any) => permission.name === 'afficher Contact'
                    );
                    this.canViewAgence = permissions.some(
                        (permission: any) => permission.name === 'afficher Agence'
                    );
                    this.buildMenu(); // Construire le menu après avoir obtenu les permissions
                },
                error: (err) => {
                    console.error('Erreur lors de la récupération des permissions :', err);
                    this.buildMenu(); // Construire le menu par défaut si une erreur survient
                }
            });
        } else {
            this.buildMenu(); // Construire le menu par défaut si l'utilisateur n'est pas authentifié
        }
    }

    // Méthode pour construire dynamiquement le menu
    buildMenu() {
        this.model = [
            { 
                label: 'Dashboards',
                icon: 'pi pi-home',
                items: [ 
                    ...(this.canViewDashboardRh ? [
                        {
                            label: 'Statistique-RH',
                            icon: 'pi pi-fw pi-chart-bar',
                            routerLink: ['/dashboard']
                        }
                    ] : []),
                    ...(this.canViewDashboardCa ? [
                        {
                            label: 'Chiffre-d\'affaire',
                            icon: 'pi pi-fw pi-chart-line',
                            routerLink: ['/dashboard/dashboard-banking']
                        }
                    ] : [])
                ]
            },
            { 
                label: 'MENU',
                icon: 'pi pi-fw pi-star-fill',
                items: [
                    ...(this.canViewTransfert ? [
                        {
                            label: 'Transfert',
                            icon: 'pi pi-fw pi-arrow-right-arrow-left',
                            routerLink: ['/dashboard/transfert']
                        }
                    ] : []),
                    ...(this.canViewFactures ? [
                        {
                            label: 'Facturation',
                            icon: 'pi pi-fw pi-calculator',
                            routerLink: ['/dashboard/facturation']
                        }
                    ] : []),
                    ...(this.canViewContact ? [
                        {
                            label: 'Contact',
                            icon: 'pi pi-fw pi-users',
                            routerLink: ['/dashboard/contact']
                        }
                    ] : []),
                    ...(this.canViewAgence ? [
                        {
                            label: 'Agence',
                            icon: 'pi pi-fw pi-map-marker',
                            routerLink: ['/dashboard/agence']
                        }
                    ] : [])
                ]
            }, 
            {
                label: 'AUTRE',
                icon: 'pi pi-cog',
                items: [
                    {
                        label: 'Parametre',
                        icon: 'pi pi-fw pi-cog',
                        items: [
                            {
                                label: 'Générale',
                                icon: 'pi pi-fw pi-globe',
                                routerLink: ['/dashboard/parametre']
                            },
                            ...(this.canViewRole ? [
                                {
                                    label: 'Role & Permission',
                                    icon: 'pi pi-fw pi-lock-open',
                                    routerLink: ['/dashboard/parametre/role-liste']
                                }
                            ] : []),
                        ]
                    }, 
                ]
            },
        ];
    }
}
