import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { CommentDto } from '../models/CommentDto';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  let commentDto: CommentDto ={
    username: "username",
    body: "body"
  }
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a get request to the comment endpoint', (done: DoneFn)=>{
    service.createComment( commentDto,1).subscribe(()=>{
      done();
    });

    const req = httpMock.expectOne(`${environment.FEMS}/posts/1/comments`);
    expect(req.request.method).toBe('POST');
    req.flush(commentDto);
  });


  it('should return commentDto with status code of 200', ()=> {

    service.createComment(commentDto,1).subscribe( (response)=> { 
      expect(response.body).toBe(commentDto);
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${environment.FEMS}/posts/1/comments`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(commentDto);
    req.flush(commentDto);
  });


});
