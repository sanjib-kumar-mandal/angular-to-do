import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  getError(e: any) {
    if (e instanceof HttpErrorResponse) {
      return {
        status: e.status,
        message: e?.error?.detail ?? e?.message ?? 'Something went wrong',
      };
    } else {
      return {
        status: 0,
        message: 'Unknown Error',
      };
    }
  }
}

export interface ErrorModel {
  status: number;
  message: string;
}
