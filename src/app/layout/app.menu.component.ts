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
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/']
                    },
                    {
                        label: 'Chiffre-d\'affaire',
                        icon: 'pi pi-fw pi-image',
                        routerLink: ['/dashboard-banking']
                    }
                ]
            },
            {
                label: 'MENU',
                icon: 'pi pi-fw pi-star-fill',
                items: [
                    // {
                    //     label: 'Transfert',
                    //     icon: 'pi pi-fw pi-user',
                    //     items: [
                    //         {
                    //             label: 'Envoie',
                    //             icon: 'pi pi-fw pi-arrow-up-right',
                    //             routerLink: ['transfert/envoie']
                    //         }, 
                    //         {
                    //             label: 'Retait',
                    //             icon: 'pi pi-fw pi-arrow-down-left',
                    //             routerLink: ['transfert/retrait']
                    //         },
                    //         {
                    //             label: 'List',
                    //             icon: 'pi pi-fw pi-list',
                    //             routerLink: ['transfert/liste']
                    //         },
                         
                    //     ]
                    // },
                    {
                        label: 'Transfert',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/transfert']
                    },
                    {
                        label: 'Facturation',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/uikit/formlayout']
                    },
                    {
                        label: 'Agence',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/agence']
                    },
                    {
                        label: 'Contact',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/contact']
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
