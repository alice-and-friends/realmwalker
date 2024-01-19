import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonstersPage } from './monsters.page';

const routes: Routes = [
  {
    path: '',
    component: MonstersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonstersPageRoutingModule {}
