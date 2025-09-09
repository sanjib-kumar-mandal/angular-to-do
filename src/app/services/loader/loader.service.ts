import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  loader$ = this.loadingSub.asObservable().pipe(distinctUntilChanged());

  /**
   * Contains in-progress loading requests
   */
  private loadingMap: Map<string, boolean> = new Map<string, boolean>();

  setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error(
        'The request url must be provided to the loading service.'
      );
    }
    if (loading === true) {
      this.loadingMap.set(url, loading);
      this.loadingSub.next(true);
    } else if (loading === false && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }

    if (this.loadingMap.size === 0) {
      this.loadingSub.next(false);
    }
  }
}
