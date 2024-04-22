import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {UserService} from "./services/user.service";
import {LocationService} from "./services/location.service";
import {ApiService} from "./services/api.service";
import {App} from "@capacitor/app";
import {filter, mergeMap} from "rxjs";
import {Browser} from "@capacitor/browser";
import {environment as env} from "../environments/environment";
import {NavigationEnd, Router} from "@angular/router";
import {AnalyticsService} from "./services/analytics.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  localTime: Date = new Date()
  callbackUri = `${env.auth.appId}://${env.auth.domain}/capacitor/${env.auth.appId}/callback`;

  constructor(
    public analytics: AnalyticsService,
    public api: ApiService,
    public auth: AuthService,
    public location: LocationService,
    public userService: UserService,
    private ngZone: NgZone,
    private router: Router
  ) {}

  async ngOnInit() {
    // Analytics
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.analytics.trackPageView(event.urlAfterRedirects);
    });

    // Location Service
    const locationServiceOperational = await this.location.init(); // TODO: Could we make the service self-initialize, same as AnalyticsService?
    console.log('Location service reports operational:', locationServiceOperational, 'Initial position:', this.location.latitude, this.location.longitude)
    if (locationServiceOperational) {
      await this.location.track();
      this.userService.login();
    } else {
      console.warn('Login aborted due to problem with location service')
    }

    // Use Capacitor's App plugin to subscribe to the `appUrlOpen` event
    App.addListener('appUrlOpen', ({ url }) => {
      // Must run inside an NgZone for Angular to pick up the changes
      // https://capacitorjs.com/docs/guides/angular
      this.ngZone.run(() => {
        if (url?.startsWith(this.callbackUri)) {
          // If the URL is an authentication callback URL...
          if (
            url.includes('state=') &&
            (url.includes('error=') || url.includes('code='))
          ) {
            // Call handleRedirectCallback and close the browser
            this.auth
              .handleRedirectCallback(url)
              .pipe(mergeMap(() => Browser.close()))
              .subscribe({
                next: (a: any) => {
                  this.userService.login();
                }
              });
          } else {
            Browser.close();
          }
        }
        else {
          console.log('Does not contain callbackUri')
        }
      });
    });
  }
}
