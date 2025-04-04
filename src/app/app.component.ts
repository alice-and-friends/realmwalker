import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {UserService} from "./services/user.service";
import {LocationService} from "./services/location.service";
import {ApiService} from "./services/api.service";
import {App} from "@capacitor/app";
import {filter, mergeMap, Subscription} from "rxjs";
import {Browser} from "@capacitor/browser";
import {environment as env} from "../environments/environment";
import {NavigationEnd, Router} from "@angular/router";
import {AnalyticsService} from "./services/analytics.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  serverTime?: Date;
  clientTime?: Date;
  private serverTimeSub?: Subscription;
  private clientTimeSub?: Subscription;
  callbackUri = `${env.auth0.appId}://${env.auth0.domain}/capacitor/${env.auth0.appId}/callback`;

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
    // Time keeping
    this.serverTimeSub = this.api.serverTime$.subscribe(time => {
      this.serverTime = time;
    });
    this.clientTimeSub = this.api.clientTime$.subscribe(time => {
      this.clientTime = time;
    });

    // Analytics
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.analytics.trackPageView(event.urlAfterRedirects);
    });

    // Use Capacitor's App plugin to subscribe to the `appUrlOpen` event
    // ...This should trigger whenever we return from one of Auth0's hosted screens
    App.addListener('appUrlOpen', ({ url }) => {
      console.log('EVENT appUrlOpen');
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
                  this.userService.autoLogin();
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

  ngOnDestroy() {
    if (this.serverTimeSub) {
      this.serverTimeSub.unsubscribe();
    }
    if (this.clientTimeSub) {
      this.clientTimeSub.unsubscribe();
    }
  }
}
