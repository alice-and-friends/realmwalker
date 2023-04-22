import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaunchPageRoutingModule } from './launch-routing.module';

import { LaunchPage } from './launch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaunchPageRoutingModule
  ],
  declarations: [LaunchPage]
})
export class LaunchPageModule {}
