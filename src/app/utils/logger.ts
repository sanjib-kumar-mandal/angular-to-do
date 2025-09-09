import { environment } from "@env/environment";

export class Logger {
  static log(message?: any, ...optionalParams: any[]) {
    if (!environment.production) {
      console.log(`[${environment.app.id}]:`, message, ...optionalParams);
    }
  }

  static error(message?: any, ...optionalParams: any[]) {
    if (!environment.production) {
      console.error(`[${environment.app.id}]:`, message, ...optionalParams);
    }
  }

  static warn(message?: any, ...optionalParams: any[]) {
    if (!environment.production) {
      console.warn(`[${environment.app.id}]:`, message, ...optionalParams);
    }
  }

  static table(tabularData?: any, properties?: string[]) {
    if (!environment.production) {
      console.table(tabularData, properties);
    }
  }

  static time(label: string) {
    if (!environment.production) {
      console.time(`[${environment.app.id}]: ${label}`);
    }
  }

  static timeEnd(label: string) {
    if (!environment.production) {
      console.timeEnd(`[${environment.app.id}]: ${label}`);
    }
  }

  static info(message?: any, ...optionalParams: any[]) {
    if (!environment.production) {
      console.info(`[${environment.app.id}]:`, message, ...optionalParams);
    }
  }

  static clear() {
    if (!environment.production) {
      console.clear();
    }
  }
}