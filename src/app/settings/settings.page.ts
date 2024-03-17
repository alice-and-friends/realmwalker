import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UserService} from "../services/user.service";
import {User} from "../models/user";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  settings: any = {};
  activeUser: User | undefined;

  constructor(protected modalCtrl: ModalController, public userService: UserService) {
    this.activeUser = userService.activeUser
  }

  onCheckboxChange(settingKey: string, event: any) {
    this.userService.updatePreference(settingKey, event.detail.checked);
  }

  close() {
    this.modalCtrl.dismiss().catch((error: Error) => console.error('Error closing modal', error));
  }

}
