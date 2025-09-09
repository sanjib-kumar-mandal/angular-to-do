import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { setTheme } from './theme.action';
import { getTheme } from './theme.selector';
import { distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private store = inject(Store);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  get theme$() {
    return this.store.select(getTheme).pipe(
      map((ev) => ev.name),
      distinctUntilChanged()
    );
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const darkThemeMq = this.document.defaultView?.matchMedia(
        '(prefers-color-scheme: dark)'
      );
      // Initial match
      this.loadTheme();
      if (darkThemeMq?.matches) {
        this.store.dispatch(setTheme({ name: 'dark' }));
      } else {
        this.store.dispatch(setTheme({ name: 'light' }));
      }
      // After change match
      darkThemeMq?.addEventListener('change', (e) => {
        this.loadTheme();
        if (e.matches) {
          this.store.dispatch(setTheme({ name: 'dark' }));
        } else {
          this.store.dispatch(setTheme({ name: 'light' }));
        }
      });
    }
  }

  private loadTheme() {
    // Get color
    const color = getComputedStyle(
      this.document.documentElement
    ).getPropertyValue('--color-background');
    // Check if meta exists
    const head = this.document.head;
    const headMeta = head.getElementsByTagName('meta');
    let hasThemeMeta = false;
    for (let i = 0, l = headMeta.length; i < l; i++) {
      if (headMeta[i].name === 'theme-color') {
        hasThemeMeta = true;
        break;
      }
    }
    // Load meta
    if (!hasThemeMeta) {
      const meta = this.document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      head.appendChild(meta);
      const msapplicationmeta = this.document.createElement('meta');
      msapplicationmeta.name = 'msapplication-navbutton-color';
      msapplicationmeta.content = color;
      head.appendChild(msapplicationmeta);
      const applemeta = this.document.createElement('meta');
      applemeta.name = 'apple-mobile-web-app-status-bar-style';
      applemeta.content = color;
      head.appendChild(applemeta);
    } else {
      const meta = head.getElementsByTagName('meta');
      for (let index = 0, l = meta.length; index < l; index++) {
        if (meta[index].name === 'theme-color') {
          meta[index].content = color;
        } else if (meta[index].name === 'msapplication-navbutton-color') {
          meta[index].content = color;
        } else if (
          meta[index].name === 'apple-mobile-web-app-status-bar-style'
        ) {
          meta[index].content = color;
        }
      }
    }
  }
}
