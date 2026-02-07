import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [RouterModule, CommonModule, FooterComponent]
})
export class HomeComponent implements OnInit {
  registrationSuccessMessage: string = '';
  logoutSuccessMessage: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden'; /* no scrollbar */
    // Leggi il parametro 'registered' dalla query string
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'success') {
        this.registrationSuccessMessage = 'Registrazione avvenuta con successo!';
        setTimeout(() => {
          this.registrationSuccessMessage = '';
        }, 5000); // Nasconde il messaggio dopo 5 secondi (5000 millisecondi)
      }
    });

    // Leggi il parametro 'loggedOut' dalla query string
  if (this.route.snapshot.queryParams['loggedOut'] === 'true') {
    this.logoutSuccessMessage = 'Logout avvenuto con successo!';
    setTimeout(() => {
      this.logoutSuccessMessage = '';
    }, 5000);// Nasconde il messaggio dopo 5 secondi (5000 millisecondi)
  }
  }
}