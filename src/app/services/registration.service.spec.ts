import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { AuthDto } from '../models/AuthDto';
import { LoginDto } from '../models/LoginDto';

import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let mockHttp: HttpTestingController;
  
  let registerDto:LoginDto = {
    "username": "user",
    "password": "password"
  };

  let authDto: AuthDto = {
    "jwt": "jwt",
    'userId': '1'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RegistrationService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a get request to correct endpoint', (done:DoneFn)=>{
    service.register(registerDto).subscribe( ()=>{
      done();
    })

    const req = mockHttp.expectOne(`${environment.Auth}/register`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should return status code of 200 and JWT if username is not taken', ()=>{
    service.register(registerDto).subscribe( (response) => {
      expect(response.body).toBe(authDto);
      expect(response.status).toBe(200);
    });
    
    const req = mockHttp.expectOne(`${environment.Auth}/register`);
    req.flush(authDto);
  });

  it('should return status code of 400 when username is taken', ()=>{
    service.register(registerDto).subscribe( (response) => {
      expect(response.status).toBe(400);
    });

    const req = mockHttp.expectOne(`${environment.Auth}/register`);
    req.event(new HttpResponse({status:400, statusText:'Bad Request'}));
  })
});
