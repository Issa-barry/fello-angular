import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Dashboards',
                icon: 'pi pi-home',
                items: [ 
                    {
                        label: 'Statistique-RH',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/']
                    },
                    {
                        label: 'Chiffre-d\'affaire',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/dashboard-banking']
                    }
                ]
            },
            {
                label: 'MENU',
                icon: 'pi pi-fw pi-star-fill',
                items: [
                    
                    {
                        label: 'Transfert',
                        icon: 'pi pi-fw pi-arrow-right-arrow-left',
                        routerLink: ['/transfert']
                    },
                    {
                        label: 'Facturation',
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: ['/uikit/formlayout']
                    },
                    {
                        label: 'Contact',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/contact']
                    },
                    {
                        label: 'Agence',
                        icon: 'pi pi-fw pi-map-marker',
                        routerLink: ['/agence']
                    },
                    {
                        label: 'Parametre',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/uikit/formlayout']
                    },
                ]
            }, 
             
            // {
            //     label: 'Autre',
            //     icon: 'pi pi-fw pi-download',
            //     items: [
            //         {
            //             label: 'Parametre',
            //             icon: 'pi pi-fw pi-cog',
            //             routerLink: ['/uikit/formlayout']
            //         },
            //         {
            //             label: 'Documentation',
            //             icon: 'pi pi-fw pi-info-circle',
            //             routerLink: ['/documentation']
            //         }
            //     ]
            // }
        ];
    }
}
