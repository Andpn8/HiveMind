import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { IdeaFormComponent } from './idea-form/idea-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './guards/auth.guard';
import { AboutUsComponent } from './about-us/about-us.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'new-idea', component: IdeaFormComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'home-page', component: HomePageComponent, canActivate: [AuthGuard] },
    { path: 'about-us', component: AboutUsComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
