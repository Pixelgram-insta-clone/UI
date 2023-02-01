import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppComponent } from './app.component';
import { PostComponent } from './components/post/post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { UserComponent } from './components/user/user.component';
import { CommentComponent } from './components/comment/comment.component'
import { MatIconModule } from '@angular/material/icon';
import { NavComponent } from './components/nav/nav.component';
import {MatMenuModule} from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent } from './components/login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './components/registration/registration.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { PostFormComponent } from './components/post-form/post-form.component';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    LandingPageComponent,
    UserComponent,
    CommentComponent,
    NavComponent,
    LoginComponent,
    RegistrationComponent,
    AddCommentComponent,
    PostFormComponent,
  ],
  imports: [
    MatCardModule,
    BrowserModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    HttpClientModule,
    MatIconModule,
    MatMenuModule,
    AppRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
