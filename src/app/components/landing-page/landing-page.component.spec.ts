import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Post } from '../../models/Post';
import { PostUIService } from '../../services/post-ui.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { LandingPageComponent } from './landing-page.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PageOfItems } from '../../models/PageOfItems';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let service: any;
  let samplePosts: Post[] = [];
  let pageOfItems: PageOfItems<Post> = {
    items: [],
    hasNext: true,
    totalElements: 0
  };
  let post: Post = {
    id: 1,
    user: {
      id: 1,
      username: 'username1',
      profileImg: 'profileimg.jpg'
    },
    img: 'i am cool',
    description: 'I am a post',
    createdOn: '2022-06-10',
    comments: {
      items: [],
      hasNext: false,
      totalElements: 0
    }
  }

  beforeAll(()=> {
    for(let i = 0; i < 5; i++) {
      samplePosts.push(post);
    }
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        InfiniteScrollModule,
      ],
      declarations: [ LandingPageComponent ],
      providers: [
        PostUIService
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(PostUIService);

    pageOfItems.hasNext = true;
    pageOfItems.totalElements = 5;
    pageOfItems.items = samplePosts;
  });

  it('should create', () => {
    let spyGetPosts = spyOn(service, "getPosts").and.callFake(() =>{
      return of(pageOfItems);
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create five post-containers', ()=> {
    let spyGetPosts = spyOn(service, "getPosts").and.callFake(() =>{
      return of(pageOfItems);
    });
    fixture.detectChanges();


    const compiled = fixture.nativeElement as HTMLElement;
    const htmlElements = compiled.querySelectorAll('.post-container');


    expect(component.postsArray.length).toEqual(5);
    // expect(htmlElements.length).toEqual(5);
  });

  it('should stop creating posts when the end of the list is reached', ()=>{

    pageOfItems.hasNext = false;
    pageOfItems.items = [];
    pageOfItems.totalElements = 0;
    let spyGetPosts = spyOn(service, "getPosts").and.callFake(() =>{
      return of(pageOfItems);
    });
    fixture.detectChanges();
    component.onScrollDown();
    expect(component.hasMorePosts).toBeFalse();
  });

  it('should create five additional post-containers', ()=> {
    let spyGetPosts = spyOn(service, "getPosts").and.callFake(() =>{
      return of(pageOfItems);
    });
    fixture.detectChanges();

    component.onScrollDown();

    const compiled = fixture.nativeElement as HTMLElement;
    const htmlElements = compiled.querySelectorAll('.post-container');

    expect(component.postsArray.length).toEqual(10);
    // expect(htmlElements.length).toEqual(10);
  });

  it('should set endOfPosts to true after receiving less than five posts', ()=> {
    pageOfItems.hasNext = false;
    pageOfItems.items = [post];
    let spyGetPosts = spyOn(service, 'getPosts').and.callFake(() =>{
      return of(pageOfItems);
    });
    component.onScrollDown();

    const compiled = fixture.nativeElement as HTMLElement;
    const htmlElements = compiled.querySelectorAll('.post-container');


    expect(component.postsArray.length).toEqual(1);
    // expect(htmlElements.length).toEqual(1);
    expect(component.hasMorePosts).toBeFalse();
  });
});
