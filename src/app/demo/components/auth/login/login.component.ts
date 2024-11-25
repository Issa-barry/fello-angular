import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent {
    rememberMe: boolean = false;

    constructor(
        public router: Router,
        private layoutService: LayoutService
    ) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    goToResetPassword(){
        this.router.navigate(['/auth/forgotpassword'])
    }
}
