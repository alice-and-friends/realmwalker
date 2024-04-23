import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import {Capacitor} from "@capacitor/core";
import {RealmLocation} from "../models/realm-location";
import {Monster} from "../models/monster";


interface AnalyticsEventParams {
  platform?: string,
  value?: number;
  method?: string;

  locationId?: string;
  locationName?: string;
  locationLevel?: string|number|undefined;
  locationType?: string|number|undefined;

  monsterId?: string|number;
  monsterName?: string;
  monsterLevel?: string|number|undefined;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  platform: string = ''
  events: AnalyticsEvents;

  constructor() {
    this.platform = Capacitor.getPlatform();
    this.events = new AnalyticsEvents(this);
    this.initGA();
  }

  public initGA(): void {
    // Avoid adding the GA tag more than once
    if (!window.dataLayer || !window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${env.googleAnalytics.trackingId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', env.googleAnalytics.trackingId, {
        'send_page_view': false,  // This is optional based on whether you want to track the initial page load.
      });
    }
  }
  public setUserId(userId: number|string): void {
    window.gtag('config', env.googleAnalytics.trackingId, {
      'user_id': userId,
    });
  }
  public trackPageView(url: string): void {
    window.gtag('config', env.googleAnalytics.trackingId, {
      'page_path': url,
    });
  }
  public trackEvent(eventName: string, eventParams: AnalyticsEventParams = {}): void {
    const snakeCase = /^[a-z0-9]+(_[a-z0-9]+)*$/;
    if (!snakeCase.test(eventName)) {
      console.error('Invalid event name: ' + eventName);
      return;
    }

    eventParams.platform = this.platform;
    window.gtag('event', eventName, eventParams);
  }
}

class AnalyticsEvents {
  constructor(private analytics: AnalyticsService) {}

  login(): void {
    this.analytics.trackEvent('log_in');
  }
  logout(): void {
    this.analytics.trackEvent('log_out');
  }
  viewLocation(params: { location: RealmLocation }): void {
    this.analytics.trackEvent('view_location', {
      locationId: params.location.id,
      locationType: params.location.type,
      locationName: params.location.name,
      locationLevel: params.location.level,
    });
  }
  battle(params: { location: RealmLocation, monster: Monster }): void {
    this.analytics.trackEvent('battle', {
      locationId: params.location.id,
      locationName: params.location.name,
      locationLevel: params.location.level,
      monsterId: params.monster.id,
      monsterName: params.monster.name,
      monsterLevel: params.monster.level,
    });
  }
  buildBase(): void {
    this.analytics.trackEvent('build_base');
  }
  collectRunestone(): void {
    this.analytics.trackEvent('collect_runestone');
  }
}
