import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginService } from 'src/app/services/login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginDto } from 'src/app/models/LoginDto';
import { AuthDto } from 'src/app/models/AuthDto';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from 'src/app/services/auth.service';
import { EventEmitter } from '@angular/core';

class MockAuthService{
  loginNotification:EventEmitter<void> = new EventEmitter<void>();
  logoutNotification:EventEmitter<void> = new EventEmitter<void>();
  authUser(authDto: AuthDto){}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: any;
  let router: Router;
  let authService: AuthService;

  let login: LoginDto = {
    username: 'test',
    password: 'testp'
  }

let authDto: AuthDto = {
  jwt: 'jwt.test.11',
  userId: '1'
}

let localStore: any;

beforeEach(() => {
  localStore = {};

  spyOn(window.localStorage, 'getItem').and.callFake((key) =>
    key in localStore ? localStore[key] : null
  );
  spyOn(window.localStorage, 'setItem').and.callFake(
    (key, value) => (localStore[key] = value + '')
  );
  spyOn(window.localStorage, 'clear').and.callFake(() => (localStore = {}));
});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {path: 'home', component: LandingPageComponent}
        ]),
        ReactiveFormsModule,
        MatCardModule,
      ],
      declarations: [ LoginComponent ],
      providers: [LoginService,
        {provide: AuthService, useClass: MockAuthService},]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(LoginService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
    component.ngOnInit();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to home if jwt is valid', fakeAsync(()=>{
    spyOn(authService, 'authUser').and.returnValue(of(new HttpResponse({status:200, statusText:"ok"})));
    localStorage.setItem("jwt",authDto.jwt);
    localStorage.setItem('userId', authDto.userId);
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    expect(router.url).toBe('/home');
  }));

  it('should succesfully login',  fakeAsync(() => {
    component.loginForm.setValue(login);
    expect(component.isUsername).toBe(false);
    expect(component.isPassword).toBe(false);
    fixture.detectChanges();

    spyOn(service, "authUser").and.returnValue(
      of(new HttpResponse<AuthDto>({body: authDto}))
    );

    component.login();
    tick();
    expect(component.loginDto).toEqual(login);

  }));


  it('should fail no username and password provided', () => {
    component.isPassword=false;
    component.isUsername=false;
    fixture.detectChanges();

    component.login();

    expect(component.isUsername).toBeTrue();
    expect(component.isPassword).toBeTrue();

  })

});
