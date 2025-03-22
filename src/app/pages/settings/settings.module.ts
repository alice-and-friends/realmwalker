import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import {DirectivesModule} from "../../directives/directives.module";
import {RouterLinkWithHref} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    DirectivesModule,
    RouterLinkWithHref,
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
