import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '@env/environment';
import { initializeApp } from 'firebase/app';
import {
  getAnalytics,
  logEvent,
  setUserProperties,
  setUserId,
} from 'firebase/analytics';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAnalyticsService {
  private app = initializeApp(environment.firebaseConfig);
  private platformId = inject(PLATFORM_ID);

  constructor() {}

  logevent(eventName: string, data: any) {
    if (isPlatformBrowser(this.platformId)) {
      const analytics = getAnalytics(this.app);
      logEvent(analytics, eventName, data);
    }
  }

  setUserProperties(data: { [key: string]: string }) {
    if (isPlatformBrowser(this.platformId)) {
      const analytics = getAnalytics(this.app);
      setUserProperties(analytics, data);
    }
  }

  screenView(screenName: string, screenClass?: string) {
    if (isPlatformBrowser(this.platformId)) {
      const analytics = getAnalytics();
      logEvent(analytics, 'screen_view', {
        firebase_screen: screenName,
        firebase_screen_class: screenClass,
      });
    }
  }

  setUserId(userId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const analytics = getAnalytics();
      setUserId(analytics, userId);
    }
  }
}
