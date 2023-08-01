import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { DungeonModalComponent } from "./dungeon-modal/dungeon-modal.component";
import {CharacterModalComponent} from "./character-modal/character-modal.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,

  ],
  declarations: [
    HomePage,
    DungeonModalComponent,
    CharacterModalComponent,
  ]
})
export class HomePageModule {}
