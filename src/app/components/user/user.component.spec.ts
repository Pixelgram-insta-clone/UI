import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { User } from 'src/app/models/User';
import { UserComponent } from './user.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('UserComponent', () => {


  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  let user: User = {
    id: 1, 
    username: 'name',
    profileImg: ''
  };


  let userEmpty: User = {
    id: 0, 
    username: '',
    profileImg: ''
  };


  beforeEach(async () => {
     TestBed.configureTestingModule({
      declarations: [ UserComponent],
     
    })
    .compileComponents();
  });

  beforeEach(() => {
     TestBed.configureTestingModule({
      declarations: [ UserComponent ],
     
    })
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance; 
    component.user = userEmpty; 
    fixture.detectChanges();
  });




  it('create component', () => {
    component.user = userEmpty; 
    expect(component).toBeTruthy();
  });

  it('it should display user', () => {

    component.user = user; 
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.username')).nativeElement;
    expect(span.textContent).toEqual(user.username);

  });

  it('it should render', ()=> {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('div')).nativeElement).toBeTruthy();
  });

  it('should toggle popUp when enter ... field', ()=>{
    const event = {type: "mouseenter"};
    component.toggleDelete(event);
    expect(component.showPopup).toBeTrue();
  });

  it('should toggle off popUp when leave delete Post field', ()=>{
    const event = {type: "mouseleave"};
    component.toggleDelete(event);
    expect(component.showPopup).toBeFalse();
  });
});
