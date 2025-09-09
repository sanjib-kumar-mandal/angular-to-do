import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  LOCALE_ID,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  KageButton,
  KageCheckbox,
  KageIcon,
  KageInput,
  KageToastCtrl,
} from 'kage-ui';
import { LoaderService } from '@services/loader/loader.service';
import { AuthService } from '@services/auth/auth.service';
import { ThemeService } from '@services/theme/theme.service';
import { FirebaseAnalyticsService } from '@services/firebase-analytics/firebase-analytics.service';
import { environment } from '@env/environment';
import { Logger } from '@utils/logger';

declare const google: any;

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-login',
  imports: [
    KageInput,
    KageButton,
    KageIcon,
    KageCheckbox,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, AfterViewInit {
  @ViewChild('googleBtn', { static: true, read: ElementRef })
  googleBtn!: ElementRef;
  // Injectors
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly loaderService = inject(LoaderService);
  private readonly themeService = inject(ThemeService);
  private readonly toastCtrl = inject(KageToastCtrl);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly analytics = inject(FirebaseAnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly localId = inject(LOCALE_ID);
  // Local variables
  formGroup!: FormGroup;
  isLoading: boolean = false;
  passwordViewStatus: boolean = false;
  theme!: 'dark' | 'light';

  ngOnInit(): void {
    this.analytics.screenView('login', 'LoginComponent');
    // Theme
    this.themeService.theme$.pipe(untilDestroyed(this)).subscribe({
      next: (theme) => (this.theme = theme),
    });
    // Loader
    this.loaderService.loader$.pipe(untilDestroyed(this)).subscribe({
      next: (isLoading) => (this.isLoading = isLoading),
    });
    // Form
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      remember: [false],
    });
    // Initiate process
    this.initiate();
  }

  ngAfterViewInit(): void {
    try {
      if (isPlatformBrowser(this.platformId)) {
        google.accounts.id.initialize({
          client_id: environment.credentials.googleClientId,
          callback: this.loginWithGoogle.bind(this),
        });
        google.accounts.id.renderButton(this.googleBtn.nativeElement, {
          theme: this.theme === 'dark' ? 'filled_black' : 'filled_blue',
          size: 'large',
          shape: 'rectangular',
          locale: this.localId,
          state: 'login btn',
          type: 'icon',
          text: 'signin_with',
        });
      } else {
        Logger.log('Not for server side');
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  private async initiate() {
    if (await this.authService.user.isLoggedin()) {
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    }
  }

  private loginWithGoogle(data: any) {
    this.authService
      .loginWithGoogle(data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          this.authService.user.set(data.data);
          this.analytics.setUserId(data.data._id);
          this.router.navigate(['/'], { replaceUrl: true });
        },
        error: (error) => {
          this.toastCtrl.show({
            message: error.error.message ?? 'Something went wrong',
            duration: 2500,
            position: 'top-right',
            type: 'danger',
          });
        },
      });
  }

  login() {
    if (this.formGroup.valid) {
      this.authService
        .login(this.formGroup.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (data: any) => {
            this.toastCtrl.show({
              message: data.detail ?? 'Login successful',
              duration: 2500,
              position: 'top-right',
              type: 'success',
            });
            sessionStorage.setItem('token', data.token);
            this.authService.user.set(data.user);
            this.analytics.setUserId(data.user.id);
            const queryParams = this.activatedRoute.snapshot.queryParamMap;
            if (queryParams.get('redirectURL')) {
              const url = decodeURI(queryParams.get('redirectURL')!);
              const urlConfig = new URL(`${location.origin}${url}`);
              const queryParamsObj: Record<string, string> = {};
              urlConfig.searchParams.forEach((value, key) => {
                queryParamsObj[key] = value;
              });
              this.router.navigate([urlConfig.pathname], {
                replaceUrl: true,
                queryParams: queryParamsObj,
              });
            } else {
              this.router.navigate(['/dashboard'], { replaceUrl: true });
            }
          },
          error: (error) => {
            this.toastCtrl.show({
              message: error.error.message ?? 'Something went wrong',
              duration: 2500,
              position: 'top-right',
              type: 'danger',
            });
          },
        });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
