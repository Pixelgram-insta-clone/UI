import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PostUIService } from 'src/app/services/post-ui.service';
import { LandingPageComponent } from '../landing-page/landing-page.component';

import { PostFormComponent } from './post-form.component';

describe('PostFormComponent', () => {
  let component: PostFormComponent;
  let fixture: ComponentFixture<PostFormComponent>;
  let service: any;
  let authService: any;
  let router: Router;
  let fb: FormBuilder = new FormBuilder();
  let el: any;
  let file = new File([""], "image", {type: 'image/png'});

  let testForm = fb.group({
    img: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostFormComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{path: 'home', component: LandingPageComponent},
        {path: 'create-post', component: PostFormComponent}]),
        MatCardModule,
        ReactiveFormsModule
      ],
      providers: [PostUIService, AuthService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    authService = TestBed.inject(AuthService);
    service = TestBed.inject(PostUIService);
    fixture = TestBed.createComponent(PostFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    el = fixture.debugElement;
    component.postForm = testForm;
    fixture.detectChanges();
 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a post if valid form', fakeAsync(() =>{
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const imageInput = el.query(By.css('#image'));
    imageInput.nativeElement.files = dataTransfer.files;
    const descriptionInput = el.query(By.css('#description'));
    descriptionInput.nativeElement.input = "text";

    localStorage.setItem('jwt', 'jwt');
    localStorage.setItem('userId', '1');

    el.nativeElement.dispatchEvent(new InputEvent('change'));
    spyOn(component, 'validateForm').and.returnValue(true);
    spyOn(service, 'createPost').and.callFake(()=>{
      return of(new HttpResponse({status: 200, statusText: 'ok'})
      )
    });

    spyOn(authService, 'authUser').and.callFake(()=> {
      return of(new HttpResponse({status: 200, statusText: 'ok'}));
    });

    fixture.detectChanges();

    component.createPost();

    flush();

    expect(router.url).toBe('/home');

  }));

  it('should return false if input was removed', () => {
    testForm.reset();

    fixture.detectChanges();

    let expected = component.validateForm();
    const elements: HTMLElement = fixture.nativeElement;
    const errorMessage = elements.querySelector('.error-message');
    expect(expected).toBeFalsy();
    expect(errorMessage?.classList).toContain('transparent');
  });

  it('should return true if input is provided', () => {
    component.postForm.clearAsyncValidators();
    component.postForm.clearValidators();
    fixture.detectChanges();
    let expected = component.validateForm();

    expect(expected).toBeFalse();

    const elements: HTMLElement = fixture.nativeElement;
    const errorMessage = elements.querySelector('.error-message');

    expect(errorMessage?.classList.contains('transparent')).toBeTruthy();
  });

  it('should reroute to homePage when cancel button is clicked', fakeAsync(() => {
    const element = fixture.debugElement;

    const button = element.query(By.css("#cancel-btn"));

    button.triggerEventHandler('click', {left: { button: 0 }});

    flush();

    expect(router.url).toBe('/home');

  } ));

  it('should convert image to base64 if file uploaded', ()=> {
    const mockEvent = {target: {files: [file]}};
    
    const mockReader: FileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);

    spyOn(window as any, 'FileReader').and.returnValue(mockReader);

    component.displayFileName(mockEvent);

    expect(component.fileName).toBeTruthy();
    expect(mockReader.readAsDataURL).toHaveBeenCalledWith(file);
  })
});
