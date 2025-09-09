import { isPlatformBrowser, Location } from '@angular/common';
import {
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
import { Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RegisterWithGoogleModel } from '@services/auth/auth.interface';
import { AuthService } from '@services/auth/auth.service';
import { ErrorService } from '@services/error/error.service';
import { FirebaseAnalyticsService } from '@services/firebase-analytics/firebase-analytics.service';
import { LoaderService } from '@services/loader/loader.service';
import { ThemeService } from '@services/theme/theme.service';
import { Logger } from '@utils/logger';
import {
  KageButton,
  KageCheckbox,
  KageIcon,
  KageInput,
  KageToastCtrl,
} from 'kage-ui';

declare const google: any;

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    KageInput,
    KageIcon,
    KageButton,
    KageCheckbox,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  // Element ref
  @ViewChild('googleBtn', { static: false, read: ElementRef })
  googleBtn!: ElementRef;
  // Injectors
  private readonly loaderService = inject(LoaderService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastCtrl = inject(KageToastCtrl);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly themeService = inject(ThemeService);
  private readonly analytics = inject(FirebaseAnalyticsService);
  private readonly errorService = inject(ErrorService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly localId = inject(LOCALE_ID);
  // Local variables
  formGroup!: FormGroup;
  isLoading: boolean = false;
  theme!: 'dark' | 'light';

  ngOnInit(): void {
    this.analytics.screenView('register', 'RegisterComponent');
    // Theme
    this.themeService.theme$.pipe(untilDestroyed(this)).subscribe({
      next: (theme) => (this.theme = theme),
    });
    // Loader
    this.loaderService.loader$.pipe(untilDestroyed(this)).subscribe({
      next: (isLoading) => (this.isLoading = isLoading),
    });
    // Form
    this.formGroup = this.formBuilder.group(
      {
        name: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required])],
        createPassword: ['', Validators.compose([Validators.required])],
        confirmPassword: ['', Validators.compose([Validators.required])],
        termsAccepted: [true],
      },
      {
        validators: this.matchPassword('createPassword', 'confirmPassword'),
      }
    );
    // Initiate
    this.initiate();
  }

  private matchPassword(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): any => {
      let psw = group.controls[passwordKey];
      let confPsw = group.controls[confirmPasswordKey];
      if (confPsw.value && psw.value !== confPsw.value) {
        return {
          misMatchPassword: true,
        };
      }
    };
  }

  private async initiate() {
    try {
      if (await this.authService.user.isLoggedin()) {
        this.location.back();
      }
    } catch (e) {
      Logger.error('Error', e);
    }
  }

  ngAfterViewInit(): void {
    try {
      if (isPlatformBrowser(this.platformId)) {
        google.accounts.id.initialize({
          client_id: environment.credentials.googleClientId,
          callback: this.registerWithGoogle.bind(this),
        });
        google.accounts.id.renderButton(this.googleBtn.nativeElement, {
          theme: this.theme === 'dark' ? 'filled_black' : 'filled_blue',
          size: 'large',
          shape: 'rectangular',
          locale: this.localId,
          state: 'register btn',
          type: 'icon',
          text: 'signup_with',
        });
      } else {
        Logger.log('Not for server side');
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  private registerWithGoogle(data: RegisterWithGoogleModel) {
    this.authService
      .registerWithGoogle(data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          this.authService.user.set(data.data);
          this.analytics.setUserId(data.data._id);
          this.router.navigate(['/'], { replaceUrl: true });
        },
        error: (error) => {
          this.toastCtrl.show({
            message: this.errorService.getError(error).message,
            duration: 2500,
            position: 'top-right',
            type: 'danger',
          });
        },
      });
  }

  register() {
    if (this.formGroup.valid) {
      this.authService
        .register(this.formGroup.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (data) => {
            this.formGroup.reset();
            this.toastCtrl.show({
              message: data.message,
              duration: 2500,
              position: 'top-right',
              type: 'success',
            });
            this.router.navigate(['/authentication/login'], {
              replaceUrl: true,
            });
          },
          error: (error) => {
            if (error.error?.errors) {
              this.formGroup.setErrors(error.error.errors);
            } else {
              this.toastCtrl.show({
                message: this.errorService.getError(error).message,
                duration: 2500,
                position: 'top-right',
                type: 'danger',
              });
            }
            this.formGroup.markAllAsTouched();
          },
        });
    }
  }
}
