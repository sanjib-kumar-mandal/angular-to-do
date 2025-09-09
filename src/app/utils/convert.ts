import { inject } from '@angular/core';
import { API_BASE_PATH } from './tokens';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * Convert any file to base64 string
 * @param file - File needs to input (Strictly)
 * @returns Base64 string
 */
export const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
};

/**
 * Converts any content url to Base64 string
 * @param url - content url (string)
 * @returns Base64 string
 */
export const urlToBase64 = async (url: string) => {
  try {
    if (!url) return Promise.reject('No image');
    const apiPath = inject(API_BASE_PATH);
    const httpClient = inject(HttpClient);

    const { base64 } = await firstValueFrom(
      httpClient.get<any>(
        `${apiPath}/api/global/proxy?url=${encodeURIComponent(url)}`
      )
    );
    return Promise.resolve(base64);
  } catch (error) {
    return Promise.reject(error); // Re-throw the error for external handling
  }
};
