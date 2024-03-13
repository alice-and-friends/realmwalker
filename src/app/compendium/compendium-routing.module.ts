import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonstersPage } from './monsters.page';
import { ItemsPage } from './items.page';
import {LootPage} from "./loot.page";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'items',
    pathMatch: 'full'
  },
  {
    path: 'monsters',
    component: MonstersPage
  },
  {
    path: 'items',
    component: ItemsPage
  },
  {
    path: 'loot',
    component: LootPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompendiumRoutingModule {}
