import { ApplicationConfig, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, provideRouter, withInMemoryScrolling } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { AppComponent } from './app.component';
import { IdeaFormComponent } from './idea-form/idea-form.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { HomePageComponent } from './home-page/home-page.component';
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { AboutUsComponent } from './about-us/about-us.component';



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(
       routes,
       withInMemoryScrolling({scrollPositionRestoration: 'enabled'}),
    ),
  ]
}

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        IdeaFormComponent,
        HomePageComponent,
        NavbarComponent,
        AboutUsComponent
    ],
    providers: [AppComponent],
    bootstrap: [],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(routes),
        CKEditorModule,
        FooterComponent,
    ]
})



export class AppConfig { }