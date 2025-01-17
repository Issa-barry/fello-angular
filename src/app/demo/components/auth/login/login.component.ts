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
  
  constructor(
    public router: Router,
    private authService: AuthService,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {}

  get dark(): boolean {
    return this.layoutService.config().colorScheme !== 'light';
  }

  login(): void {
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe(
      (response) => { 
        console.log('Connexion réussie :', response);
        this.router.navigate(['/dashboard']); 
      },
      (error) => {
        this.errorMessage = 'Échec de la connexion, vérifiez vos identifiants.';
        console.error('Erreur de connexion :', error);
      }
    );
  }

  goToResetPassword(): void {
    this.router.navigate(['/auth/forgotpassword']);
  }

  handleFelloClick(): void {
    console.log('FELLO clicked!');
    this.router.navigate(['/some-page']);
  }
}
