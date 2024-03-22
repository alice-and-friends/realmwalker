import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {AuthService} from "@auth0/auth0-angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  settings: any = {};
  activeUser: User | undefined;

  constructor(protected modalCtrl: ModalController, public userService: UserService, private auth: AuthService, private router: Router) {
    this.activeUser = userService.activeUser
  }

  onCheckboxChange(settingKey: string, event: any) {
    this.userService.updatePreference(settingKey, event.detail.checked);
  }

  onSelectChange(settingKey: string, event: any) {
    this.userService.updatePreference(settingKey, event.detail.value);
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: document.location.origin } })
  }

  close() {
    this.modalCtrl.dismiss().catch((error: Error) => console.error('Error closing modal', error));
  }

  goToCredits() {
    this.modalCtrl.dismiss()
    this.router.navigate(['/credits'])
  }
}
