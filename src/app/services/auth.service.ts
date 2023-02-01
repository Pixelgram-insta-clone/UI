import { HttpClient, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthDto } from '../models/AuthDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginNotification:EventEmitter<void> = new EventEmitter<void>();
  logoutNotification:EventEmitter<void> = new EventEmitter<void>();
  
  constructor(private httpClient: HttpClient) { }

  authUser(authDto: AuthDto): Observable<HttpResponse<any>>{
    return this.httpClient.post<any>(
      `${environment.Auth}/authenticate`,
      authDto.jwt,
      {observe: 'response'}
    );
  }
}
