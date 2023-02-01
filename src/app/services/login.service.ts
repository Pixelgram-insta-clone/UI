import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthDto } from '../models/AuthDto';
import { LoginDto } from '../models/LoginDto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  authUser(loginDto: LoginDto): Observable<HttpResponse<any>>{
    return this.httpClient.post<any>(
      `${environment.Auth}/login`,
      loginDto,
      {observe: 'response'}
    );
}
}
