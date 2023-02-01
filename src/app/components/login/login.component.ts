import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDto } from 'src/app/models/LoginDto';
import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginDto!: LoginDto;
  isUsername: boolean = false;
  isPassword: boolean = false;
  invalidcredentials: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

    this.isLoggedIn();

    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      password: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
    });

    this.authService.loginNotification.subscribe(()=>{
      this.router.navigate(['/home']);
    })
  }


  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  login() {
    this.isUsername = false;
    this.isPassword = false;
    this.invalidcredentials = false;

    if (this.loginForm.valid) {

      this.loginDto = {
        ...this.loginForm.value
      }

      this.loginService.authUser(this.loginDto).subscribe({
        next: (response) => {
          if (response.body?.jwt) {
            localStorage.setItem('jwt', response.body.jwt);
            this.authService.loginNotification.emit();
            localStorage.setItem('userId', response.body.userId);
            this.router.navigate(['/home']);
          }
        }
        ,
        error: () => {
          this.invalidcredentials = true;
        }
      });
    } else {

      if (!this.loginForm.value.username.trim()) {
        this.isUsername = true;
      }

      if (!this.loginForm.value.password.trim()) {
        this.isPassword = true;
      }
    }
  }

  isLoggedIn() {
    let jwt = localStorage.getItem("jwt");
    let userId = localStorage.getItem('userId');
    if (jwt != null && userId) {
      let validJwt = false;
      this.authService.authUser({ jwt: jwt, userId: userId }).subscribe({
        next: (response) => {
          if (response.status == 200) {
            validJwt = true;
            this.authService.loginNotification.emit();
          } else {
            this.authService.logoutNotification.emit();
          }
        },
        error: () => {
          this.authService.logoutNotification.emit();
        }
      });
      return validJwt;
    } else {
      return false;
    }
  }

}
