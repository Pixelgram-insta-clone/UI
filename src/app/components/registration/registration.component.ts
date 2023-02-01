import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDto } from 'src/app/models/LoginDto';
import { AuthService } from 'src/app/services/auth.service';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  usernameIsEmpty: boolean = false;
  passwordIsEmpty: boolean = false;
  invalidUsername: boolean = false;
  registrationDto!: LoginDto;

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isLoggedIn();

    this.registrationForm = this.fb.group({
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

  register(){
    this.usernameIsEmpty = false;
    this.passwordIsEmpty = false;
    this.invalidUsername = false;

    if(this.registrationForm.valid){
      this.registrationDto = {...this.registrationForm.value}

      this.registrationService.register(this.registrationDto).subscribe({
        next: (response) => {
          if(response.body?.jwt) {
            localStorage.setItem('jwt', response.body.jwt);
            localStorage.setItem('userId', response.body.userId)
            this.authService.loginNotification.emit();
            this.router.navigate(['/home']);
          }
        },
        error: () => {
          this.invalidUsername = true;
        }
      });
    } else{
      if(!this.registrationForm.value.username.trim()){
        this.usernameIsEmpty = true;
      }

      if(!this.registrationForm.value.password.trim()){
        this.passwordIsEmpty = true;
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
