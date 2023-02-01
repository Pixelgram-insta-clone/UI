import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthDto } from '../models/AuthDto';
import { LoginDto } from '../models/LoginDto';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private httpClient:HttpClient) { }

  register(registerDto:LoginDto): Observable<HttpResponse<AuthDto>>{
    return this.httpClient.post<AuthDto>(`${environment.Auth}/register`, 
      registerDto,
      {observe:'response'}
    );
  };
}
