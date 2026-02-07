import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = '';
  flashMessage: any;
  showErrorMessage: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden'; /* no scrollbar */
  }

  onSubmit() {
    console.log('Register form submitted');

    this.authService.register(this.username, this.password, this.email).subscribe(
      response => {
        console.log('User registered', response);
        this.router.navigate(['/home'], { queryParams: { registered: 'success' } });
      },
      error => {
        console.error('Error registering user', error);
        this.errorMessage = 'Nome utente già in utilizzo!';
        this.showErrorMessage = true;
      }
    );
  }
}
