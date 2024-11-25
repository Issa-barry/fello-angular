import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent {
    rememberMe: boolean = false;
    email: string = '';
    password: string = ''; 
    errorMessage: string = ''; 

    constructor(
        public router: Router,
        private authService: AuthService,
        private layoutService: LayoutService
    ) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

   //Login
 login() {
        // this.errorMessage = ''; // Réinitialiser le message d'erreur
        const credentials = { email: this.email, password: this.password };

        this.authService.login(credentials).subscribe({
            next: (user) => {
                if (user) {
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


}
