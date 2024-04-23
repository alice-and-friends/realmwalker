import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {AuthService} from "@auth0/auth0-angular";
import {Router} from "@angular/router";
import {environment as env} from "../../../environments/environment";
import {Browser} from "@capacitor/browser";
import {Capacitor} from "@capacitor/core";
import {AnalyticsService} from "../../services/analytics.service";

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
    protected modalCtrl: ModalController,
    private analytics: AnalyticsService,
    private auth: AuthService,
    private router: Router
  ) {
    this.activeUser = userService.activeUser
  }

  onCheckboxChange(settingKey: string, event: any) {
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
    this.modalCtrl.dismiss().catch((error: Error) => console.error('Error closing modal', error));
  }

  goToCredits() {
    this.close()
    this.router.navigate(['/credits'])
  }
}
