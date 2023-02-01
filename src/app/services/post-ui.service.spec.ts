import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { PageOfItems } from '../models/PageOfItems';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { PostUIService } from './post-ui.service';
import {User} from '../models/User'

const mockPostList: PageOfItems<Post>[] = [];

describe('PostUIService', () => {
  let service: PostUIService;
  let httpMock: HttpTestingController;

  let mockPostList: PageOfItems<Post> = {
    items: [],
    hasNext: true,
    totalElements: 0
  };

  let mockCommentList: PageOfItems<Comment> = {
    items: [],
    hasNext: true,
    totalElements: 0
  };

  let user: User = {
    id: 1,
    username: "testy",
    profileImg: "http"
  }
  
  let post: Post = {
    id: 1,
    user: user,
    img: 'i am cool',
    description: 'This is a description of a dog. It is a Shibu Inu with a very strong stance. Shibu Inus are very active animals.',
    createdOn: '2022-06-10',
    comments: {
      items: [],
      hasNext: false,
      totalElements: 0
    }
  }

  let comment: Comment = {
    id: 1,
    postId: 1,
    username: 'Username',
    body: "body",
    createdOn: '2022-06-10'
  };
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(PostUIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a get request to the post endpoint', (done: DoneFn)=>{
    service.getPosts(0, 5).subscribe(()=>{
      done();
    });

    for(let i = 0; i < 5; i++) {
      mockPostList.items.push(post);
    }

    const req = httpMock.expectOne(`${environment.FEMS}/posts?pageNumber=0&pageSize=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPostList);
  });

  it('should send a get request to the comment endpoint', (done: DoneFn)=>{
    service.getComments(1, 0, 5).subscribe(()=>{
      done();
    });

    for(let i = 0; i < 5; i++) {
      mockCommentList.items.push(comment);
    }

    const req = httpMock.expectOne(`${environment.FEMS}/posts/1/comments?pageNumber=0&pageSize=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCommentList);
  })
});
