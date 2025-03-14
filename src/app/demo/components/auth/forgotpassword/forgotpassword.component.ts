import { Component } from '@angular/core';
import { AuthService } from 'src/app/demo/service/auth/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './forgotpassword.component.html',
})
export class ForgotPasswordComponent {
    email = '';
    errorMessage = '';
    emailValid = true; 
    successMessage: string = '';

    constructor(private layoutService: LayoutService, private authService: AuthService) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    sendLink() {
        this.errorMessage = '';
        this.successMessage = '';
    
        if (!this.validateEmail(this.email)) {
          this.errorMessage = 'Adresse email invalide.';
          return;
        }
    
        this.authService.sendResetPasswordLink(this.email).subscribe({
          next: (response) => {
            this.successMessage = response.message || 'Email envoyé avec succès.';
          },
          error: (err) => {
            this.errorMessage = err.error.error || 'Erreur lors de l\'envoi du lien.';
          },
        });
      }

      validateEmail(email: string): boolean {
        const emailPattern = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
      }
    
    
}
