import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NavComponent } from './nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthDto } from 'src/app/models/AuthDto';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let router: Router;
  let authDto: AuthDto = {
    "jwt": "jwt",
    "userId": "1"
  }
  let service: any;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavComponent ],
      imports: [
        RouterTestingModule.withRoutes(
        [
         {path: 'home', component: LandingPageComponent},
         {path: 'login', component: LoginComponent}
        ]
      ),
      HttpClientTestingModule,
      MatMenuModule],
      providers: [AuthService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  let localStore: any;

  beforeEach(() => {
    localStore = {};

    spyOn(localStorage, 'getItem').and.callFake( (key:string):string => {
      return localStore[key] || null;
     });
     spyOn(localStorage, 'removeItem').and.callFake((key:string):void =>  {
       delete localStore[key];
     });
     spyOn(localStorage, 'setItem').and.callFake((key:string, value:string):string =>  {
       return localStore[key] = <string>value;
     });
     spyOn(localStorage, 'clear').and.callFake(() =>  {
      localStore = {};
     });
     router = TestBed.inject(Router);
  });

  beforeEach(() => {
    service = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove the jwt when logout', () => {
    component.logout();
    expect(localStorage.getItem('jwt')).toBeNull();
  });

  it('should check jwt when logged in and visiting to site', () => {
    localStorage.setItem("jwt", authDto.jwt);
    localStorage.setItem('userId', authDto.userId);
    const expectedResponse = {status: 200, statusText: 'ok'};
    fixture.detectChanges();
    let spy = spyOn(service, "authUser").and.callFake(() => {
      return (of(expectedResponse))
    });
    
    expect(component.isLoggedIn()).toBeTrue();
  });

  it('should check jwt when not logged in and visiting site', () => {
    expect(component.isLoggedIn()).toBeFalse();
  });

  it('should check routerlink status for home page', fakeAsync(() => {
    router.navigate(["/home"]);
    fixture.detectChanges();
    tick();
    expect(component.checkRouterLink()).toBeTrue();
  }));

  it('should check routerlink status for login page', fakeAsync(() => {
    router.navigate(["/login"]);
    fixture.detectChanges();
    tick();
    expect(component.checkRouterLink()).toBeFalse();
  }));

  it('should reroute to landing', fakeAsync(() => {
    component.logout()
    fixture.detectChanges();
    tick();
    expect(router.url).toBe('/home');
  }));
});
