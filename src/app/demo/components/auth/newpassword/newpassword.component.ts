import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PasswordService } from 'src/app/demo/service/auth/password/password.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './newpassword.component.html',
    providers: [MessageService, ConfirmationService],
})
export class NewPasswordComponent implements OnInit {
    password = '';
    confirmPassword = '';
    rememberMe = false;
    loading = false;
    submitted = false;
    token = '';
    email = '';
    errors: { [key: string]: string } = {};
    errorMessage = '';
    resetPasswordDialog = false;

    constructor(
        private passwordService: PasswordService,
        private layoutService: LayoutService,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        const queryParams = this.route.snapshot.queryParams;
        this.token = queryParams['token'] || '';
        this.email = queryParams['email'] || '';
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    openDialog(): void {
        this.resetPasswordDialog = true;
    }

    /** Ferme tous les dialogues et réinitialise le formulaire */
    hideDialog(): void {
        this.resetPasswordDialog = false;
        this.submitted = false;
    }

    resetPassword(): void {
        this.submitted = true;
        this.errors = {};
        this.errorMessage = '';

        if (!this.password || !this.confirmPassword) {
            this.errorMessage = 'Tous les champs sont obligatoires.';
            return;
        }

        this.loading = true;
        const data = this.buildResetData();

        this.passwordService.resetPassword(data).subscribe({
            next: (response) => this.handleSuccess(response),
            error: (error) => this.handleError(error),
        });
    }

    private buildResetData() {
        return {
            email: this.email,
            token: this.token,
            password: this.password,
            password_confirmation: this.confirmPassword,
        };
    }

    private handleSuccess(response: any) {
        this.loading = false;
        this.submitted = false;

        this.confirmationService.confirm({
            message: ' Cliquez sur "Se connecter" pour continuer.',
            header: response.message,
            icon: 'pi pi-check-circle',
            acceptLabel: 'Se connecter',
            rejectVisible: false,
            accept: () => {
                this.router.navigate(['/auth/login']);
            },
            reject: () => {
                this.resetPasswordDialog = false;
            },
         });
    }

    private handleError(err: any) {
        console.error(err);
        const validationErrors = err?.error?.data || {};
        this.errors = {};

        // Itère sur chaque champ avec erreur
        for (const field in validationErrors) {
            if (validationErrors.hasOwnProperty(field)) {
                this.errors[field] = validationErrors[field].join(' ');
            }
        }

        this.errorMessage = err?.error?.message || '';
        this.loading = false;
        this.submitted = false;
    }
}
