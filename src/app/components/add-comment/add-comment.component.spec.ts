import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthDto } from 'src/app/models/AuthDto';
import { CommentService } from 'src/app/services/comment.service';

import { AddCommentComponent } from './add-comment.component';

describe('AddCommentComponent', () => {
  let component: AddCommentComponent;
  let fixture: ComponentFixture<AddCommentComponent>;
  let authDto: AuthDto = {
    "jwt": "jwt",
    "userId": "userId"
  }
  let service: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [ AddCommentComponent ],
      providers: [
          CommentService
        ],
    })
    .compileComponents();
  });

  let localStore: any;
  let clicked: boolean;
  beforeEach(() => {
    clicked = false;
    localStore = {};
    spyOn(localStorage, 'getItem').and.callFake( (key:string):string => {
      return localStore[key] || null;
     });
     spyOn(localStorage, 'removeItem').and.callFake((key:string):void =>  {
       delete localStore[key];
     });
     spyOn(localStorage, 'setItem').and.callFake((key:string, value:string) =>  {
       localStore[key] = value;
     });
     spyOn(localStorage, 'clear').and.callFake(() =>  {
      localStore = {};
     });
  });

  beforeEach(() => {
    service = TestBed.inject(CommentService);
    fixture = TestBed.createComponent(AddCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should check jwt when logged in and visiting to site', () => {
    localStorage.setItem("jwt", authDto.jwt);
    localStorage.setItem("userId", authDto.userId); 
    fixture.detectChanges();
    
    expect(component.isLoggedIn()).toBeTrue();
  });

  it('should retrieve the username of a user that is logged in', ()=>{
    localStorage.setItem("userId", authDto.userId); 
    fixture.detectChanges();
    const expectedResponse = {status: 200, statusText: 'ok', body:{username:"user1"}};
    spyOn(service, "getUsername").and.callFake(() => {
      return (of(expectedResponse))
    });
    component.ngOnInit();
    expect(component.username).toBe("user1");
  })

  it('should clear local storage if the user does not exist for the saved userId', ()=>{
    localStorage.setItem('userId', '1');
    fixture.detectChanges();
    spyOn(service, "getUsername").and.callFake(() => {
      return throwError(()=>new Error("Bad request."))});
    component.ngOnInit();
    expect(localStorage.getItem('userId')).toBeFalsy();
  });

  it('should switch value of clicked', () => {
    component.removeButton();
    expect(clicked).toBeFalse();
  });

  it('should clear the form and reverse the clicked variable when a comment is successfully submitted', ()=>{
    component.commentForm.setValue({body: "This is a comment"});
    component.username = "user";
    component.clicked = true;
    component.post = {
      id: 1,
      user: {id: 0, username: "user1", profileImg:""},
      img: '',
      description: '',
      createdOn: '',
      comments: {items:[], hasNext: false, totalElements: 5}
    }
    fixture.detectChanges();
    spyOn(service, "createComment")
      .and.returnValue(of(new HttpResponse({body: "response body"})));

    component.submitComment();

    expect(component.commentForm.valid).toBeFalse();
    expect(component.clicked).toBeFalse();
  });

  it('should set commentIsEmpty to true and return false if no body was provided', ()=> {
    let validForm = component.validateForm();
    expect(component.commentIsEmpty).toBeTrue();
    expect(validForm).toBeFalse();
  })
});


