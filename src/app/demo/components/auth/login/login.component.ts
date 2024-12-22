import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    rememberMe: boolean = false;
    email: string = '';
    password: string = ''; 
    errorMessage: string = ''; 
    private userInfo: any; 

    constructor(
        public router: Router, 
        private authService: AuthService,
        private layoutService: LayoutService
    ) {}

    ngOnInit(): void {
        
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

   //Login
   login() {
    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
        next: (user) => {
            if (user) {
                this.userInfo = this.authService.getUserInfo(); // Récupère les infos de l'utilisateur
                console.log('Utilisateur connecté :', this.userInfo); // Affiche dans la console
                this.router.navigate(['/dashboard']);
            }
        },
        error: (err) => {
            this.errorMessage = 'Email ou mot de passe incorrect.';
            console.error(err);
        },
    });
}


    goToResetPassword(){
        this.router.navigate(['/auth/forgotpassword'])
    }


    handleFelloClick() {
        console.log('FELLO clicked!');
        // Vous pouvez rediriger ou exécuter une autre logique ici
        this.router.navigate(['/some-page']);
    }
    

}
