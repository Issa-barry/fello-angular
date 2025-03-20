import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './newpassword.component.html',
    providers: [MessageService],
})
export class NewPasswordComponent {
    rememberMe: boolean = false;
    password: string = '';
    confirmPassword: string = '';
    loading : boolean = false
    submitted = false;
    token: string = '';
    errors: { [key: string]: string } = {};
    errorMessage: string = '';

 
    constructor(
        private authService: AuthService,
        private layoutService: LayoutService,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Récupérer le token depuis l'URL
        this.token = this.route.snapshot.queryParams['token'] || '';
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    resetPassword(): void {
        this.submitted = true;
        this.errors = {};

        if (!this.password || !this.confirmPassword) {
            this.errorMessage = 'Tous les champs sont obligatoires.';
            return;
        }
 
        this.errorMessage = '';
        
        const data = {
            email: "i8699@example.com",
            token: this.token,
            password: this.password,
            password_confirmation: this.confirmPassword,
        };

        this.loading = true;
        this.authService.resetPassword(data).subscribe({
            next: (response) => {
            
             
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: response.message  ,
                    life: 7000,
                });
                this.loading = false
                this.submitted = false;
                //   this.successMessage = 'Votre mot de passe a été réinitialisé avec succès ! Redirection...';
                setTimeout(() => this.router.navigate(['/auth/login']), 7000);
            },
            error: (err) => {
                console.error(err)
                if (err.error && err.error.errors) {
                    this.errors = err.error.errors;
                }

                if (err.error && err.error.error) {
                    this.errorMessage = err.error.error || "Une erreur s'est produite.";
                }

              
              this.loading = false,
              this.submitted = false;
            }
          });
        
    }

   
}
