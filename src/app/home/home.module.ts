import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { DungeonModalComponent } from "./dungeon-modal/dungeon-modal.component";
import {CharacterModalComponent} from "./character-modal/character-modal.component";
import {BattleResultModalComponent} from "./dungeon-modal/battle-result-modal/battle-result-modal.component";
import {NpcModalComponent} from "./npc-modal/npc-modal.component";
import {ModalHeaderComponent} from "../components/modal-header/modal-header.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  declarations: [
    HomePage,
    NpcModalComponent,
    DungeonModalComponent,
    CharacterModalComponent,
    BattleResultModalComponent,
    ModalHeaderComponent,
  ]
})
export class HomePageModule {}
