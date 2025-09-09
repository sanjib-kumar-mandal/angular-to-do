import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { API_BASE_PATH } from '@utils/tokens';
import {
  CurrentUserModel,
  LoginModel,
  LoginWithGoogleModel,
  RegisterWithGoogleModel,
  SignUpModel,
} from './auth.interface';
import { distinctUntilChanged, filter, firstValueFrom, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setCurrentUser } from './auth.action';
import { getAuth } from './auth.selector';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Logger } from '@utils/logger';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Injectors
  private readonly apiBase = inject(API_BASE_PATH);
  private readonly httpClient = inject(HttpClient);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    this.keepProfileUpdated();
  }

  keepProfileUpdated() {
    this.loginWithAccessToken();
  }

  get user() {
    return {
      set: (data: CurrentUserModel) =>
        this.store.dispatch(setCurrentUser(data)),
      get: () =>
        this.store.select(getAuth).pipe(
          filter((x) => x !== undefined),
          distinctUntilChanged()
        ),
      isActive: async () =>
        Boolean((await firstValueFrom(this.store.select(getAuth))).isActive),
      isLoggedin: async () =>
        Boolean(await firstValueFrom(this.store.select(getAuth))),
      value: async () => await firstValueFrom(this.store.select(getAuth)),
    };
  }

  private loginWithAccessToken() {
    if (isPlatformBrowser(this.platformId)) {
      this.httpClient
        .get(`${this.apiBase}/Api/Authentication/LoginWithAccessToken`)
        .subscribe({
          next: (data: any) => this.user.set(data.user),
          error: (error) => {
            Logger.error('Login with access token', error);
            this.user.set(null!);
          },
        });
    }
  }

  login(info: LoginModel) {
    return this.httpClient.post<{ status: number; message: string; data: any }>(
      `${this.apiBase}/Api/Authentication/LoginWithEmailAndPassword`,
      info
    );
  }

  loginWithGoogle(credentials: LoginWithGoogleModel) {
    return this.httpClient.post<{ status: number; message: string; data: any }>(
      `${this.apiBase}/api/Authentication/loginWithGoogle`,
      credentials
    );
  }

  register(info: SignUpModel) {
    return this.httpClient.post<{ status: number; message: string }>(
      `${this.apiBase}/Api/Authentication/RegisterWithEmailAndPassword`,
      info
    );
  }

  registerWithGoogle(credentials: RegisterWithGoogleModel) {
    return this.httpClient.post<{ status: number; message: string; data: any }>(
      `${this.apiBase}/api/Authentication/registerWithGoogle`,
      credentials
    );
  }

  verifyEmail(token: string, email: string) {
    return this.httpClient.put(
      `${this.apiBase}/api/dashboard/auth/verifyEmail`,
      { token, email }
    );
  }

  forgotPassword(data: any) {
    return this.httpClient.post(
      `${this.apiBase}/api/dashboard/auth/forgotPassword`,
      data
    );
  }

  canResetPassword(data: any) {
    return this.httpClient.put<{ status: number; message: string; data: any }>(
      `${this.apiBase}/api/dashboard/auth/canResetPassword`,
      data
    );
  }

  resetPassword(data: {
    [key in 'email' | 'token' | 'newPassword' | 'confirmPassword']: string;
  }) {
    return this.httpClient.put<{
      status: number;
      message: string;
      data: any;
    }>(`${this.apiBase}/api/dashboard/auth/resetPassword`, data);
  }

  changePassword(data: {
    [key in 'oldPassword' | 'newPassword' | 'confirmPassword']: string;
  }) {
    return this.httpClient.put<{ status: number; message: string }>(
      `${this.apiBase}/api/dashboard/auth/changePassword`,
      data
    );
  }

  logout() {
    return this.httpClient
      .get(`${this.apiBase}/api/dashboard/auth/logout`)
      .pipe(
        tap((ev) => {
          this.user.set(null!);
          this.router.navigateByUrl('/');
        })
      );
  }
}
