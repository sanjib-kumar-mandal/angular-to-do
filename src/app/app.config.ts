import {
  APP_ID,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '@services/auth/auth.reducer';
import { themeReducer } from '@services/theme/theme.reducer';
import { networkReducer } from '@services/network/network.reducer';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { loggerInterceptor } from '@interceptors/logger/logger.interceptor';
import { cookieInterceptor } from '@interceptors/cookie/cookie.interceptor';
import { loaderInterceptor } from '@interceptors/loader/loader.interceptor';
import { API_BASE_PATH } from '@utils/tokens';
import { environment } from '@env/environment';
import { errorInterceptor } from '@interceptors/error/error-interceptor';
import { headerInterceptor } from '@interceptors/header/header-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        errorInterceptor,
        loggerInterceptor,
        cookieInterceptor,
        loaderInterceptor,
        headerInterceptor,
      ])
    ),
    provideClientHydration(withEventReplay()),
    provideStore({
      CurrentUser: currentUserReducer,
      Theme: themeReducer,
      Network: networkReducer,
    }),
    { provide: APP_ID, useValue: environment.app.id },
    { provide: API_BASE_PATH, useValue: environment.apiBasePath },
  ],
};
