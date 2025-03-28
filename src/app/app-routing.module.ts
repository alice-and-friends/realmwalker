import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import {locationGuard} from "./location.guard";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard, locationGuard],
  },
  {
    path: 'main-menu',
    loadChildren: () => import('./pages/main-menu/main-menu.module').then(m => m.MainMenuPageModule)
  },
  {
    path: 'callback',
    loadChildren: () => import('./features/callback/callback.module').then( m => m.CallbackModule),
  },
  {
    path: '',
    redirectTo: 'main-menu',
    pathMatch: 'full'
  },
  {
    path: 'compendium',
    loadChildren: () => import('./pages/compendium/compendium.module').then(m => m.CompendiumModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'credits',
    loadChildren: () => import('./pages/credits/credits.module').then( m => m.CreditsPageModule)
  },
  {
    path: 'battle/:id',
    loadChildren: () => import('./pages/battle/battle.module').then( m => m.BattlePageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
