import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import {locationGuard} from "./location.guard";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard, locationGuard],
  },
  {
    path: 'launch',
    loadChildren: () => import('./launch/launch.module').then( m => m.LaunchPageModule)
  },
  {
    path: 'callback',
    loadChildren: () => import('./features/callback/callback.module').then( m => m.CallbackModule),
  },
  {
    path: '',
    redirectTo: 'launch',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
