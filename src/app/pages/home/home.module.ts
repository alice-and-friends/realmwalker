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
import {ModalHeaderComponent} from "../../components/modal-header/modal-header.component";
import {BaseModalComponent} from "./location-modal/base-modal/base-modal.component";
import {ConstructionModalComponent} from "./construction-modal/construction-modal.component";
import {MapMarkerComponent} from "../../components/map-marker/map-marker.component";
import {CountdownPipe} from "../../countdown.pipe";
import {RunestoneModalComponent} from "./location-modal/runestone-modal/runestone-modal.component";
import {ItemIconComponent} from "../../components/item-icon/item-icon.component";
import {LeyLineModalComponent} from "./location-modal/ley-line-modal/ley-line-modal.component";
import {JournalModalComponent} from "./journal-modal/journal-modal.component";
import {EventsToolbarComponent} from "../../components/events-toolbar/events-toolbar.component";
import {EventModalComponent} from "./event-modal/event-modal.component";
import {RenewableModalComponent} from "./location-modal/renewable-modal/renewable-modal.component";
import {DirectivesModule} from "../../directives/directives.module";
import {BattleSiteModalComponent} from "./location-modal/battle-site-modal/battle-site-modal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    DirectivesModule,
  ],
  declarations: [
    HomePage,
    NpcModalComponent,
    DungeonModalComponent,
    RunestoneModalComponent,
    CharacterModalComponent,
    BattleResultModalComponent,
    ModalHeaderComponent,
    BaseModalComponent,
    LeyLineModalComponent,
    ConstructionModalComponent,
    JournalModalComponent,
    MapMarkerComponent,
    CountdownPipe,
    ItemIconComponent,
    EventsToolbarComponent,
    EventModalComponent,
    RenewableModalComponent,
    BattleSiteModalComponent,
  ]
})
export class HomePageModule {}
