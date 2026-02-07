import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showErrorMessage: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('User logged in', response);
        this.router.navigate(['/home-page']);
      },
      error => {
        console.error('Error logging in', error);
        this.showErrorMessage = true;
        this.errorMessage = 'Login fallito: controlla le tue credenziali';
      }
    );
  }
}