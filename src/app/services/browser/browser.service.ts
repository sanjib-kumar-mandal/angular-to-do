import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserService {
  private readonly document = inject(DOCUMENT);

  open(url: string, target?: '_blank' | '_self') {
    this.document.defaultView?.open(url, target ?? '_blank');
  }
}
