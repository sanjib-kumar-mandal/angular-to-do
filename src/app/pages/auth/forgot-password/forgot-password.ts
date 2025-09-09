import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '@services/auth/auth.service';
import { FirebaseAnalyticsService } from '@services/firebase-analytics/firebase-analytics.service';
import { LoaderService } from '@services/loader/loader.service';
import { KageButton, KageIcon, KageInput, KageToastCtrl } from 'kage-ui';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-forgot-password',
  imports: [
    RouterLink,
    KageInput,
    KageIcon,
    KageButton,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly analytics = inject(FirebaseAnalyticsService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly loaderService = inject(LoaderService);
  private readonly toastCtrl = inject(KageToastCtrl);
  // Local variables
  formGroup!: FormGroup;
  isLoading: boolean = false;

  ngOnInit(): void {
    // Log screen view event
    this.analytics.screenView('forgot-password', 'ForgotPasswordComponent');
    // Check for loader
    this.loaderService.loader$.pipe(untilDestroyed(this)).subscribe({
      next: (isLoading) => (this.isLoading = isLoading),
    });
    // Login status check
    this.authService.user.isLoggedin().then((isLoggedin) => {
      if (isLoggedin) {
        this.toMyprofile();
      }
    });
    // Create form group
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
    });
  }

  sendMail() {
    if (this.formGroup.valid) {
      this.authService
        .forgotPassword(this.formGroup.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (data: any) => {
            this.toastCtrl.show({
              message: data.message ?? 'Success',
              duration: 2500,
              position: 'top-right',
              type: 'success',
            });
            this.router.navigate(['/authentication/login'], {
              replaceUrl: true,
            });
          },
          error: (e) => {
            this.toastCtrl.show({
              message: e.message ?? 'Something went wrong',
              duration: 2500,
              position: 'top-right',
              type: 'danger',
            });
          },
        });
    } else {
      this.formGroup.markAsDirty();
    }
  }

  toMyprofile() {
    this.router.navigate(['/my-profile'], { replaceUrl: true });
  }
}
