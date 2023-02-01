import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostDto } from 'src/app/models/PostDto';
import { AuthService } from 'src/app/services/auth.service';
import { PostUIService } from 'src/app/services/post-ui.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  postForm!: FormGroup;
  image!: string;
  description!: string;
  placeholderId = 1;
  fileName = '';
  base64Rep = '';
  imageError: boolean = false;
  descriptionError: boolean = false;

  postDto: PostDto = {
    img: this.image,
    description: this.description
  };

  constructor(
    private postUIService: PostUIService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {
    if(!localStorage.getItem('jwt')) {
      this.rerouteHomePage();
    } else {
      this.postForm = this.fb.group({
        img: new FormControl('', [Validators.required, this.fileTypeValidator]),
        description: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      });
    }
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  fileTypeValidator(control:FormControl){
    let regex = /(.*?).(jpg|png|jpeg)$/;
    let regexTest = regex.test(control.value.toLowerCase());
    return regexTest ? null : { "notSupportedFileType": true };
  }
  
  createPost(){
    if(this.validateForm()) {
      this.postDto = {
        img: this.base64Rep,
        description: this.postForm.value.description
      }
      let userId = localStorage.getItem('userId');
      
      this.postUIService.createPost(this.postDto, userId).subscribe({
        next: (response) => {
          if(response.status == 200) {
            this.rerouteHomePage();
          }
        },
        error: () => {
          alert('Failed to create post at this time.');
        }
      });
    }     
  }

  validateForm(){
    this.imageError = false;
    this.descriptionError = false;
    if(this.postForm.valid) {
      return true;
    } else {
      if(!this.postForm.value.img) {
        this.imageError = true;
      }
      if(!this.postForm.value.description.trim()) {
        this.descriptionError = true;
      }
      return false;
    }
  }
  
  rerouteHomePage(){
    this.router.navigate(['/home']);
  }

  displayFileName(event: any) {
    
    const file:File = event.target.files[0];

    if(file) {
      if(file.type.split('/')[0] == 'image'){
        this.fileName = file.name;

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imgBase64Path = e.target.result;
          this.base64Rep = imgBase64Path;
        };
        reader.readAsDataURL(file);
      } else {
        this.imageError = true;
        alert("Only images are accepted");
      }
    }
  }
}
