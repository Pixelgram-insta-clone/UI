import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/Comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  @Input() comment!:Comment;
  commentSlice: number = 100;
  moreButton: string = "more";
  ellipses: string = "... "

  constructor() { }

  toggleComment() {
    if (this.moreButton.includes("more")) {
      this.commentSlice = this.comment.body.length;
      this.moreButton = "less";
      this.ellipses = "";
    } else {
      this.moreButton = "more"
      this.commentSlice = 100;
      this.ellipses = "... "
    }
  }


}
