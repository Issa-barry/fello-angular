import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { AuthService } from '../demo/service/auth/auth.service';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html'
})
export class AppProfileSidebarComponent {

    constructor(
        public router: Router,
        private authService: AuthService,
        public layoutService: LayoutService
    ) { }

    get visible(): boolean {
        return this.layoutService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.profileSidebarVisible = _val;
    }

    onLogOut(){
       this.router.navigate(['/']);
    }

        // Méthode de déconnexion
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Utilisateur déconnecté');
      },
      error: (err) => {
        console.error('Erreur de déconnexion', err);
      }
    });
  }
}