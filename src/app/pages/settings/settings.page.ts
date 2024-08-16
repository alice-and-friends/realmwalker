import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {AuthService} from "@auth0/auth0-angular";
import {Router} from "@angular/router";
import {environment as env} from "../../../environments/environment";
import {Browser} from "@capacitor/browser";
import {Capacitor} from "@capacitor/core";
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
  platform = Capacitor.getPlatform();

  constructor(
    public userService: UserService,
    protected modalService: ModalService,
    private analytics: AnalyticsService,
    private auth: AuthService,
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

  logout() {
    this.analytics.events.logout()

    if (this.platform === 'web') {
      this.auth.logout({ logoutParams: { returnTo: document.location.origin } })
    }
    else {
      const returnTo = `${env.auth0.appId}://${env.auth0.domain}/capacitor/${env.auth0.appId}/callback`;

      this.auth
        .logout({
          logoutParams: {
            returnTo,
          },
          async openUrl(url: string) {
            await Browser.open({ url });
          }
        })
        .subscribe({
          next: () => {
            this.userService.logout()
            this.close()
          }
        });
    }
  }

  close() {
    void this.modalService.dismiss()
  }

  goToCredits() {
    this.close()
    void this.router.navigate(['/credits'])
  }
}
