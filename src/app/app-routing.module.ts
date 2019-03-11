import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canLoad: [AuthGuard]},
  { path: 'favorite', loadChildren: './favorite/favorite.module#FavoritePageModule', canLoad: [AuthGuard] },
  { path: 'post', loadChildren: './post/post.module#PostPageModule', canLoad: [AuthGuard] },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule', canLoad: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
