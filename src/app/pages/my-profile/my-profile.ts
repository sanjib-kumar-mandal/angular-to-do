import { Component, inject } from '@angular/core';
import {
  KageBreadCrumbs,
  KageBreadCrumb,
  KageButton,
  KageAlertCtrl,
  KageToastCtrl,
} from 'kage-ui';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-my-profile',
  imports: [KageBreadCrumbs, KageBreadCrumb, KageButton, RouterLink],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss',
})
export class MyProfile {
  private readonly alertCtrl = inject(KageAlertCtrl);
  private readonly toastCtrl = inject(KageToastCtrl);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    this.authService.user.get().subscribe({
      next: (data) => {
        if (!Boolean(data)) {
          this.router.navigate(['/authentication/login'], { replaceUrl: true });
        }
      },
    });
  }

  async signOut() {
    const ref = await this.alertCtrl.show({
      message: 'Are you sure you want to sign out?',
      title: 'Sign out!!',
      buttons: [
        { label: 'Yes', color: 'success', role: 'confirm' },
        { label: 'No', color: 'danger', role: 'cancel' },
      ],
    });
    if (ref.button?.role === 'confirm') {
      this.authService
        .logout()
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.toastCtrl.show({
              message: 'Logged out',
              duration: 2500,
              position: 'top-right',
              type: 'success',
            });
          },
          error: (error) => {
            this.toastCtrl.show({
              message: 'Failed to logged out',
              duration: 2500,
              position: 'top-right',
              type: 'danger',
            });
          },
        });
    }
  }
}
