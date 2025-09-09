import { InjectionToken } from '@angular/core';

export const API_BASE_PATH = new InjectionToken<string>(
  'Backend server base URL'
);
