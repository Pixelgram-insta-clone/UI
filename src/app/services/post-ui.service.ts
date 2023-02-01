import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PageOfItems } from '../models/PageOfItems';
import { Post } from '../models/Post';
import { PostDto } from '../models/PostDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostUIService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http:HttpClient) { }

  getPosts(pageNumber:number, pageSize:number){
    return this.http.get<PageOfItems<Post>>(`${environment.FEMS}/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`, this.httpOptions);
  }

  getComments(postId:number, pageNumber:number, pageSize: number){
    return this.http.get<PageOfItems<Comment>>(`${environment.FEMS}/posts/${postId}/comments?pageNumber=${pageNumber}&pageSize=${pageSize}`, this.httpOptions);
  }

  createPost(postDto: PostDto, userId: string|null): Observable<HttpResponse<any>>{
    return this.http.post(`${environment.FEMS}/users/${userId}/posts`, postDto, {observe: 'response'});
    
  }

}
