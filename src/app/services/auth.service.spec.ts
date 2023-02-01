import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { AuthDto } from '../models/AuthDto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockAuthDto: AuthDto = {
    jwt : '123.abc.2w3',
    userId: '1'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a post request to the authenticate endpoint', ()=>{

    const expectedResponse = new HttpResponse({status: 200, statusText: 'ok'});
    service.authUser(mockAuthDto).subscribe( (response)=> { 
      console.log("Running test.")
      expect(response).toBe(expectedResponse);
    });

    const req = httpMock.expectOne(`${environment.Auth}/authenticate`);
    expect(req.request.method).toBe('POST');
    req.event(expectedResponse);
  });
  
  it('should return observable with status code of 200 when token is valid', ()=>{
    const expectedResponse = new HttpResponse({status: 200, statusText: 'ok'});

    service.authUser(mockAuthDto).subscribe( (response)=> { 
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${environment.Auth}/authenticate`);
    req.event(expectedResponse);
  });

  it('should return observable with status code of 400 when token is invalid', ()=>{
    const expectedResponse = new HttpResponse({status: 400, statusText: 'Bad Request'});

    service.authUser(mockAuthDto).subscribe( (response)=> { 
      expect(response.status).toBe(400);
    });

    const req = httpMock.expectOne(`${environment.Auth}/authenticate`);
    req.event(expectedResponse);
  });
});
