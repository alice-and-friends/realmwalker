import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() {
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

  public trackPageView(url: string): void {
    window.gtag('config', env.googleAnalytics.trackingId, {
      'page_path': url,
    });
  }

  public trackEvent(eventName: string, eventParams: any): void {
    window.gtag('event', eventName, eventParams);
  }
}
