import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { getNetwork } from './network.selector';
import { distinctUntilChanged, map } from 'rxjs';
import { setNetwork } from './network.action';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private platformId = inject(PLATFORM_ID);
  private store = inject(Store);

  get isOnline() {
    return this.store.select(getNetwork).pipe(
      map((ev) => ev.status),
      distinctUntilChanged()
    );
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.monitorConnectivity();
    }
  }

  private monitorConnectivity() {
    window.addEventListener('offline', () =>
      this.store.dispatch(setNetwork({ status: false }))
    );
    window.addEventListener('online', () => {
      this.store.dispatch(setNetwork({ status: true }));
    });
  }
}
