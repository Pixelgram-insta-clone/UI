import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { PostUIService } from '../../services/post-ui.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  postsArray: Post[] = [];
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = "down";
  pageNumber: number = 0;
  hasMorePosts: boolean = true;
  defaultUser = {
    id: 0,
    username: "anonymous",
    profileImg: ""
  };

  constructor(private postService: PostUIService) {}

  //Get First page of posts on load
  ngOnInit(): void {
    this.getPosts();

  }

  //Get posts if user has scrolled to last if there are more posts to get
  getPosts() {
    if (this.hasMorePosts) { //Check if there are more posts to retrieve
      this.postService.getPosts(this.pageNumber, 5).subscribe({
        next: (data) => { //Use service to get more posts
          if (data.items) {
            this.sortPosts(data.items);
            for (let post of data.items) {
              if (!post.user) {
                post.user = this.defaultUser;
              }
              this.postsArray.push(post);
            }
          }
          this.hasMorePosts = data.hasNext; //Set whether there are more posts from response
        },
        error: () => {
          this.hasMorePosts = false;
        }
      });
    }
  }

  sortPosts(posts: Post[]){
    posts.sort(function (a: Post, b: Post) {
      return a.id > b.id ? -1 : 1;
    })
  }

  //Run this if user has scrolled to last post
  onScrollDown() {
    this.pageNumber++;
    this.getPosts();
  }
}
