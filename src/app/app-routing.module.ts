import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { RegistrationComponent } from './components/registration/registration.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'register', component: RegistrationComponent},
  { path: 'home', component: LandingPageComponent},
  { path: 'login', component: LoginComponent },
  { path: 'create-post', component: PostFormComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
