import { Component, OnInit } from '@angular/core';
import { Post } from '../post/post.model';
import { PostService } from '../post/post.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  loadedPosts: Post[];

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadedPosts = this.postService.posts;
    console.log(this.loadedPosts);
  }
}
