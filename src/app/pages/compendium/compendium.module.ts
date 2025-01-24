import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompendiumRoutingModule } from './compendium-routing.module';

import { MonstersPage } from './monsters.page';
import { ItemsPage } from './items.page';
import { LootPage } from './loot.page';
import {EquipmentPage} from "./equipment.page";
import {PortraitPage} from "./portrait.page";
import {HomePageModule} from "../home/home.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompendiumRoutingModule,
    HomePageModule,
  ],
  declarations: [MonstersPage, ItemsPage, LootPage, EquipmentPage, PortraitPage]
})
export class CompendiumModule {}
