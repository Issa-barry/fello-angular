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
            // {
            //     label: 'Apps',
            //     icon: 'pi pi-th-large',
            //     items: [
            //         {
            //             label: 'Blog',
            //             icon: 'pi pi-fw pi-comment',
            //             items: [
            //                 {
            //                     label: 'List',
            //                     icon: 'pi pi-fw pi-image',
            //                     routerLink: ['/apps/blog/list']
            //                 },
            //                 {
            //                     label: 'Detail',
            //                     icon: 'pi pi-fw pi-list',
            //                     routerLink: ['/apps/blog/detail']
            //                 },
            //                 {
            //                     label: 'Edit',
            //                     icon: 'pi pi-fw pi-pencil',
            //                     routerLink: ['/apps/blog/edit']
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Calendar',
            //             icon: 'pi pi-fw pi-calendar',
            //             routerLink: ['/apps/calendar']
            //         },
            //         {
            //             label: 'Chat',
            //             icon: 'pi pi-fw pi-comments',
            //             routerLink: ['/apps/chat']
            //         },
            //         {
            //             label: 'Files',
            //             icon: 'pi pi-fw pi-folder',
            //             routerLink: ['/apps/files']
            //         },
            //         {
            //             label: 'Kanban',
            //             icon: 'pi pi-fw pi-sliders-v',
            //             routerLink: ['/apps/kanban']
            //         },
            //         {
            //             label: 'Mail',
            //             icon: 'pi pi-fw pi-envelope',
            //             items: [
            //                 {
            //                     label: 'Inbox',
            //                     icon: 'pi pi-fw pi-inbox',
            //                     routerLink: ['/apps/mail/inbox']
            //                 },
            //                 {
            //                     label: 'Compose',
            //                     icon: 'pi pi-fw pi-pencil',
            //                     routerLink: ['/apps/mail/compose']
            //                 },
            //                 {
            //                     label: 'Detail',
            //                     icon: 'pi pi-fw pi-comment',
            //                     routerLink: ['/apps/mail/detail/1000']
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Task List',
            //             icon: 'pi pi-fw pi-check-square',
            //             routerLink: ['/apps/tasklist']
            //         }
            //     ]
            // },
            {
                label: 'MENU',
                icon: 'pi pi-fw pi-star-fill',
                items: [
                    {
                        label: 'Transfert',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Envoie',
                                icon: 'pi pi-fw pi-arrow-up-right',
                                routerLink: ['profile/create']
                            },
                            {
                                label: 'Retait',
                                icon: 'pi pi-fw pi-arrow-down-left',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'List',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/agence']
                            },
                         
                        ]
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
                        routerLink: ['/uikit/formlayout']
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
