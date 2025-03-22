import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {Router} from "@angular/router";
import {AnalyticsService} from "../../services/analytics.service";
import {ModalService} from "../../services/modal.service";
import {SoundAsset, SoundService} from "../../services/sound.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  settings: any = {};
  activeUser: User | undefined;

  constructor(
    public userService: UserService,
    protected modalService: ModalService,
    private analytics: AnalyticsService,
    private router: Router,
    private soundService: SoundService,
  ) {
    this.activeUser = userService.activeUser
  }

  onCheckboxChange(settingKey: string, event: any) {
    if (settingKey === 'sound' && event.detail.checked) {
      void this.soundService.playSound(SoundAsset.Click);
    }
    this.userService.updatePreference(settingKey, event.detail.checked);
  }

  onSelectChange(settingKey: string, event: any) {
    this.userService.updatePreference(settingKey, event.detail.value);
  }

  async logout() {
    await this.modalService.dismissAll();
    this.analytics.events.logout()
    this.userService.logoutAndRedirect();
  }

  async close() {
    await this.modalService.dismiss()
  }

  goToMainMenu() {
    void this.close()
    void this.router.navigate(['/main-menu'])
  }

  goToCredits() {
    void this.close()
    void this.router.navigate(['/credits'])
  }
}
