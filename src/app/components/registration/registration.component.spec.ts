import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthDto } from 'src/app/models/AuthDto';
import { LoginDto } from 'src/app/models/LoginDto';
import { AuthService } from 'src/app/services/auth.service';
import { RegistrationService } from 'src/app/services/registration.service';
import { LandingPageComponent } from '../landing-page/landing-page.component';

import { RegistrationComponent } from './registration.component';

class MockAuthService{
  authUser(authDto: AuthDto){}
}
class MockRegistrationService{
  register(){}
}

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let service: RegistrationService;
  let router: Router;
  let authService: AuthService;

  let mockRegistrationDto: LoginDto = {
    "username": "test",
    "password": "testp"
  };

  let authDto: AuthDto = {
    "jwt": "123.test.4er",
    "userId": "1"
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'home', component: LandingPageComponent}
        ]),
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [ RegistrationComponent ],
      providers: [
        {provide: AuthService, useClass: MockAuthService},
        {provide: RegistrationService, useClass: MockRegistrationService},
        AuthService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RegistrationService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to home if jwt is valid', fakeAsync(()=>{
    spyOn(localStorage, 'getItem').and.returnValue("jwt");
    spyOn(authService, 'authUser').and.returnValue(of(new HttpResponse({status:200, statusText:"ok"})));
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(router.url).toBe('/home');
  }));

  it('should successfuly register a user', fakeAsync(() => {
    component.registrationForm.setValue(mockRegistrationDto);
    spyOn(service, "register").and.returnValue(of(new HttpResponse<AuthDto>({body: authDto})));
    fixture.detectChanges();

    component.register();
    tick();

    expect(component.usernameIsEmpty).toBe(false);
    expect(component.passwordIsEmpty).toBe(false);

    expect(component.registrationDto).toEqual(mockRegistrationDto);
    expect(localStorage.getItem("jwt")).toBe(authDto.jwt);
    expect(router.url).toBe('/home');
  }));

  it('should not register because there are empty fields', () => {
    component.register();
    expect(component.usernameIsEmpty).toBeTrue();
    expect(component.usernameIsEmpty).toBeTrue();
  });

  it('should not register if input is only whitespace', ()=>{
    let whitespace: LoginDto = {
      "username": "  ",
      "password": "  "
    }
    component.registrationForm.setValue(whitespace);
    fixture.detectChanges();
    component.register();
    expect(component.usernameIsEmpty).toBeTrue();
    expect(component.passwordIsEmpty).toBeTrue();
  })

  it('should not register because an username already taken', () => {
    component.registrationForm.setValue(mockRegistrationDto);
    spyOn(service, "register").and.returnValue(throwError({status: 400}));

    fixture.detectChanges();
    component.register();
    expect(component.invalidUsername).toBeTrue();
  });
});
