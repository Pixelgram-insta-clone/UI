import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { AuthDto } from '../models/AuthDto';
import { LoginDto } from '../models/LoginDto';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let mockHttp: HttpTestingController;

  let loginDto: LoginDto = {
    "username": "user",
    "password": "password"
  }

  let authDto: AuthDto = {
    "jwt": "jwt",
    'userId': '1'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      HttpClientTestingModule
    ]});
    service = TestBed.inject(LoginService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return AuthDto with status code of 200 when valid login', ()=> {

    service.authUser(loginDto).subscribe( (response)=> { 
      expect(response.body).toBe(authDto);
      expect(response.status).toBe(200);
    });

    const req = mockHttp.expectOne(`${environment.Auth}/login`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(loginDto);
    req.flush(authDto);
  });

  it('should return status code of 400 when invalid login', ()=> {

    service.authUser(loginDto).subscribe( (response)=> { 
      expect(response.status).toBe(400);
    });

    const req = mockHttp.expectOne(`${environment.Auth}/login`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(loginDto);

    const expectedResponse = new HttpResponse({status: 400, statusText: 'Bad Request'});
    req.event(expectedResponse);
  });
});
