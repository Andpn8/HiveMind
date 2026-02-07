import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IdeaService } from '../_services/idea.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-idea-form',
  templateUrl: './idea-form.component.html',
  styleUrls: ['./idea-form.component.scss']
})
export class IdeaFormComponent {
  public Editor = ClassicEditor;
  public ideaTitle: string = '';
  public ideaDescription: string = '';
  public maxCharacters = 400;
  public showAlert = false;

  public editorConfig = {
    toolbar: {
      items: [
        '|',
        'bold',
        'italic',
        '|',
        'bulletedList',
        'numberedList',
        '|'
      ]
    },
    language: 'it'
  };

  constructor(private ideaService: IdeaService, private authService: AuthService, private router: Router) {}

  public onSubmit(form: NgForm) {
    // Verifica se il campo titolo è vuoto
    if (!this.ideaTitle.trim()) {
      // Se è vuoto, mostra l'avviso
      form.controls['title'].markAsDirty(); // Segna il campo come "toccato" per mostrare l'avviso
      return; // Interrompi l'invio del form
    }

    if (this.ideaDescription.length > this.maxCharacters) {
      this.showAlert = true; // Mostra l'avviso se la descrizione supera i caratteri consentiti
      return; // Interrompi l'invio del form
    }

    // Chiamata al servizio IdeaService per creare un'idea
    this.ideaService.createIdea({ title: this.ideaTitle, description: this.ideaDescription })
      .subscribe(
        (response) => {
          console.log('Idea creata con successo:', response);
          //Resetta il form
          form.resetForm();
          this.router.navigate(['/home-page'], { queryParams: { published: 'true' } });
        },
        (error) => {
          console.error('Errore durante la creazione dell\'idea:', error);
        }
      );
  }

  public onHideAlert() {
    this.showAlert = false;
  }
}
