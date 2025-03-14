import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './forgotpassword.component.html',
    providers: [MessageService],
})
export class ForgotPasswordComponent {
    email = '';
    errorMessage = '';
    emailValid = true;
    loading = false;
    successMessage: string = '';

    constructor(
        private authService: AuthService,
        private layoutService: LayoutService,
        private messageService: MessageService,
    ) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    sendLink() {
        this.errorMessage = '';
        this.successMessage = '';
        this.loading = true;

        if (!this.validateEmail(this.email)) {
            this.errorMessage = 'Adresse email invalide.';
            return;
        }

        this.authService.sendResetPasswordLink(this.email).subscribe({
            next: (response) => {
               
                   this.successMessage = response.message
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: response.message  ,
                        life: 7000,
                    });
                    this.loading = false
            },
            error: (err) => {
                this.errorMessage =
                    err.error.error || "Erreur lors de l'envoi du lien.";
                    this.loading = false
            },
        });
    }

    validateEmail(email: string): boolean {
        const emailPattern =
            /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }
}
