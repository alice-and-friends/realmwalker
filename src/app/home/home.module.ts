import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { DungeonModalComponent } from "./location-modal/dungeon-modal/dungeon-modal.component";
import {CharacterModalComponent} from "./character-modal/character-modal.component";
import {BattleResultModalComponent} from "./location-modal/dungeon-modal/battle-result-modal/battle-result-modal.component";
import {NpcModalComponent} from "./location-modal/npc-modal/npc-modal.component";
import {ModalHeaderComponent} from "../components/modal-header/modal-header.component";
import {BaseModalComponent} from "./location-modal/base-modal/base-modal.component";
import {ConstructionModalComponent} from "./construction-modal/construction-modal.component";
import {MapMarkerComponent} from "../components/map-marker/map-marker.component";
import {CountdownPipe} from "../countdown.pipe";


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
    BaseModalComponent,
    ConstructionModalComponent,
    MapMarkerComponent,
    CountdownPipe,
  ]
})
export class HomePageModule {}
