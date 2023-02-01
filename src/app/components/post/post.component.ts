import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { Comment } from 'src/app/models/Comment';
import { PostUIService } from 'src/app/services/post-ui.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post!:Post;

  postUsername: string = "username";
  descSlice: number = 80;
  moreButton: string = "more";
  ellipses: string = "... ";
  pageNumber: number = 0;
  commentsArray: Comment[] = [];
  hasMoreComments: boolean = true;
  commentCount: number = 0;

  constructor(private postService: PostUIService) { }

  ngOnInit(): void {
    this.post.comments.items.forEach((comment) =>{
      this.commentsArray.push(comment);
    });
    this.hasMoreComments = this.post.comments.hasNext;
    this.pageNumber++;
    this.commentCount = this.post.comments.totalElements;
    this.postUsername = this.post.user.username;
  }

  toggleDesc() {
    if (this.moreButton.includes("more")) {
      this.descSlice = this.post.description.length;
      this.moreButton = "less";
      this.ellipses = "";
    } else {
      this.moreButton = "more"
      this.descSlice = 80;
      this.ellipses = "... "
    }
  }

  getComments() {
    this.postService.getComments(this.post.id, this.pageNumber, 5).subscribe({
      next: (data: { items: any; hasNext: boolean; }) =>{ //Use service to get more comments
        if(data.items) {
          data.items.sort(function(a: Comment, b: Comment) {
            let dateA = new Date(a.createdOn).getTime();
            let dateB = new Date(b.createdOn).getTime();
            return dateA > dateB ? -1 : 1;
          });
          for(let comment of data.items) {
            this.commentsArray.push(comment);
          }
        }
        this.hasMoreComments = data.hasNext; //Set whether there are more posts from response
        this.pageNumber++;
      },
      error: ()=>{
        this.hasMoreComments = false;
      }
    });
  }

  addComment(comment: Comment) {
    this.commentsArray = [comment].concat(this.commentsArray);
    this.commentCount++;
  }
}
