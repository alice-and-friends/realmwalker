import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainMenuRoutingModule } from './main-menu-routing.module';

import { MainMenuPage } from './main-menu-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainMenuRoutingModule
  ],
  declarations: [MainMenuPage]
})
export class MainMenuPageModule {
}
