import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageOfItems } from 'src/app/models/PageOfItems';
import { Post } from '../../models/Post';
import { Comment } from '../../models/Comment';
import { PostUIService } from 'src/app/services/post-ui.service';
import { PostComponent } from './post.component';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let service: any;
  let pageOfItems: PageOfItems<Comment> = {
    items: [],
    hasNext: true,
    totalElements: 0
  };
  let comment: Comment = {
    id: 1,
    postId: 1,
    username: 'Username',
    body: "body",
    createdOn: '2022-06-10'
  };
  let post: Post = {
    id: 1,
    user: {
      id: 1,
      username: 'username1',
      profileImg: 'profileimg.jpg'
    },
    img: 'i am cool',
    description: 'This is a description of a dog. It is a Shibu Inu with a very strong stance. Shibu Inus are very active animals.',
    createdOn: '2022-06-10',
    comments: {
      items: [],
      hasNext: false,
      totalElements: 0
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        MatCardModule,],
      declarations: [ PostComponent ],
      providers: [PostUIService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });
  let localStore: any;

  beforeEach(() => {
    localStore = {};

    spyOn(localStorage, 'getItem').and.callFake( (key:string):string => {
      return localStore[key] || null;
     });
     spyOn(localStorage, 'removeItem').and.callFake((key:string):void =>  {
       delete localStore[key];
     });
     spyOn(localStorage, 'setItem').and.callFake((key:string, value:string):string =>  {
       return localStore[key] = <string>value;
     });
     spyOn(localStorage, 'clear').and.callFake(() =>  {
      localStore = {};
     });

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    component.post = post;
    service = fixture.debugElement.injector.get(PostUIService);
    fixture.detectChanges();
    pageOfItems.items = []
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create five comments', () => {
    for(let i = 0; i < 5; i++) {
      pageOfItems.items.push(comment);
    }
    spyOn(service, "getComments").and.callFake(() =>{
      return of(pageOfItems);
    });
    component.getComments();
    expect(component.commentsArray.length).toBe(5);
  });

  it('should toggle desc', () => {
    expect(component.descSlice).toBe(80);
    expect(component.moreButton).toBe('more');
    expect(component.ellipses).toBe('... ');
    component.toggleDesc();
    expect(component.moreButton).toBe('less');
    expect(component.ellipses).toBe('');
    expect(component.descSlice).toBe(post.description.length);
  });

  it('should check else condition', () => {
    component.moreButton = 'less';
    component.toggleDesc();
    expect(component.moreButton).toBe('more');
    expect(component.ellipses).toBe('... ');
    expect(component.descSlice).toBe(80);
  });

  it('should view five more comments', () => {
    for(let i = 0; i < 5; i++) {
      pageOfItems.items.push(comment);
    }
    let spyGetPosts = spyOn(service, "getComments").and.callFake(() =>{
      return of(pageOfItems);
    });
    component.getComments();
    expect(component.commentsArray.length).toBe(5);

  })



});
