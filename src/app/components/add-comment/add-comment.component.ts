import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { CommentService } from 'src/app/services/comment.service';
import { CommentDto } from 'src/app/models/CommentDto';
import { Comment } from 'src/app/models/Comment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})

export class AddCommentComponent implements OnInit {

  @Input() post!: Post;
  @Output() commentsArrayChange = new EventEmitter<Comment>();

  commentForm!: FormGroup;
  commentIsEmpty: boolean = false;
  commentDto!: CommentDto;
  
  clicked: boolean = false;
  username!: string;
  userId: any;


  constructor(
    private commentService: CommentService, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.commentForm = this.fb.group({
      body: new FormControl('', [Validators.required, this.noWhitespaceValidator])
    });
    if(this.userId){
      this.commentService.getUsername(this.userId).subscribe( {
        next: (data) =>{
          this.username = data.body.username;
        
        },
        error: () =>{
          localStorage.clear();
          alert("Please login");
        }
      });
    }
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  isLoggedIn(): boolean {
    let jwt = localStorage.getItem("jwt");
    let userId = localStorage.getItem("userId");
    return jwt && userId ? true : false;
  }

  removeButton() {
    this.clicked = !this.clicked;
  }

  submitComment() {
    if(this.validateForm()) {
      this.commentDto = {
        username: this.username,
        body: this.commentForm.value.body
      }
      let postId = this.post.id;

      this.commentService.createComment(this.commentDto, postId).subscribe({
        next: (response) => {
          this.commentsArrayChange.emit(response.body);
          this.commentForm.reset();
          this.clicked = !this.clicked;
        },
        error: () => {
          alert("Could not add comment at this time.");
        }
      })
    }
  }

  validateForm() {
    this.commentIsEmpty = false;
    if(this.commentForm.valid) {
      return true;
    } else {
      if(!this.commentForm.value.body) {
        this.commentIsEmpty = true;
      }
      return false;
    }
  }
}