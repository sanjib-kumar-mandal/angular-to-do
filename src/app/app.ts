import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  NgZone,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Header } from './components/header/header';
import { AuthService } from '@services/auth/auth.service';
import { ThemeService } from '@services/theme/theme.service';
import { FirebaseAnalyticsService } from '@services/firebase-analytics/firebase-analytics.service';
import { SeoService } from '@services/seo/seo.service';
import { NetworkService } from '@services/network/network.service';
import { filter, map, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { NgClass } from '@angular/common';
import { LoaderService } from '@services/loader/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild('routerArea', { read: ElementRef }) routerArea!: ElementRef;
  // Injections
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly analyticService = inject(FirebaseAnalyticsService);
  private readonly seoService = inject(SeoService);
  private readonly networkService = inject(NetworkService);
  private readonly loaderService = inject(LoaderService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly chg = inject(ChangeDetectorRef);
  // Local variables
  private readonly headerHidenOn = ['login', 'register', 'forgot-password'];
  isHeaderActive = true;
  isOnline = true;
  isLoading = true;

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((ev) => {
          if (isPlatformBrowser(this.platformId)) {
            if (this.routerArea) {
              this.routerArea.nativeElement.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }
          }
        }),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (child.snapshot.data && child.snapshot.data['rootId']) {
              return child.snapshot.data['rootId'];
            } else {
              return null;
            }
          }
          return null;
        })
      )
      .subscribe({
        next: (data) => {
          this.isHeaderActive = !this.headerHidenOn.includes(data);
          this.chg.markForCheck();
        },
      });
  }

  ngOnInit(): void {
    this.loaderService.loader$.subscribe({
      next: (isLoading) => {
        this.isLoading = isLoading;
        this.chg.markForCheck();
      },
    });
    this.networkService.isOnline.subscribe({
      next: (status) => {
        this.isOnline = status;
        this.chg.markForCheck();
      },
    });
  }
}
