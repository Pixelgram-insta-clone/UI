import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentDto } from '../models/CommentDto';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  createComment(commentDto: CommentDto, postId: number|null): Observable<HttpResponse<any>>{
    return this.http.post(`${environment.FEMS}/posts/${postId}/comments`, commentDto, {observe: 'response'});
    
  }

  getUsername(userId: string|null): Observable<HttpResponse<any>>{
    return this.http.get(`${environment.FEMS}/users/${userId}`
    ,{observe: 'response'
    });
  }
}
