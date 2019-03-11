import { Injectable } from '@angular/core';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private _posts: Post[] = [
    new Post(
      1,
      'Grilled broiler chicken',
      'Good price',
      1.25,
      10,
      '15.03.2019',
      'https://s3.amazonaws.com/finecooking.s3.tauntonclud.com/app/uploads/2017/04/18170559/051121045-02-broiled-bbq-chicken-recipe-main.jpg',
      'K-Citymarket'
    ),
    new Post(
      2,
      'Apple Turnover',
      'Good price',
      0.99,
      30,
      '15.03.2019',
      'https://www.solofoods.com/sites/default/files/styles/custom_recipe_image/public/cherry-turnover-recipe.jpg?itok=C79l0Cpj',
      'Lidl'
    ),
    new Post(
      3,
      'Hornet Snacks Buffalo',
      'Good price',
      5.49,
      15,
      '18.03.2019',
      'https://www.atria.fi/contentassets/15f94749c4194d1bb766433fc1576173/3719.jpg?w=555&h=555',
      'Prisma'
    ),
  ];

  get posts() {
    return [...this._posts];
  }

  constructor() { }

  getPostById(id: number) {
    return {...this._posts.find(post => post.id === id)};
  }
}
