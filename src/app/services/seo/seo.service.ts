import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { websiteSchema } from '@utils/schema';
import { API_BASE_PATH } from '@utils/tokens';
import { MetaData } from './seo.interface';
import { timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly httpClient = inject(HttpClient);
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly apiPath = inject(API_BASE_PATH);

  /**
   * Adding or Updating SEO Data
   * @param metaData MetaData
   */
  loadMeta(metaData: MetaData) {
    const urlConfig = new URL(this.doc.URL);
    if (metaData) {
      // Title tag
      this.title.setTitle(metaData.title ?? '');
      // Description
      if (this.meta.getTag("name='description'")) {
        this.meta.updateTag({
          name: 'description',
          content: metaData.description ?? '',
        });
      } else {
        this.meta.addTag({
          name: 'description',
          content: metaData.description ?? '',
        });
      }
      // Robots
      if (this.meta.getTag("name='robots'")) {
        this.meta.updateTag({
          name: 'robots',
          content: metaData.robots ?? '',
        });
      } else {
        this.meta.addTag({
          name: 'robots',
          content: metaData.robots ?? '',
        });
      }
      // Keywords
      if (this.meta.getTag("name='keywords'")) {
        this.meta.updateTag({
          name: 'keywords',
          content: metaData.keywords,
        });
      } else {
        this.meta.addTag({ name: 'keywords', content: metaData.keywords });
      }
      // Author
      if (this.meta.getTag("name='author'")) {
        this.meta.updateTag({
          name: 'author',
          content: environment.app.name,
        });
      } else {
        this.meta.addTag({
          name: 'author',
          content: environment.app.name,
        });
      }
      // Open graph
      if (!this.meta.getTag("property='og:type'")) {
        this.meta.addTag({ property: 'og:type', content: 'website' });
      }
      if (this.meta.getTag("property='og:url'")) {
        this.meta.updateTag({
          property: 'og:url',
          content: `${urlConfig.origin}${urlConfig.pathname}`,
        });
      } else {
        this.meta.addTag({
          property: 'og:url',
          content: `${urlConfig.origin}${urlConfig.pathname}`,
        });
      }
      if (this.meta.getTag("property='og:title'")) {
        this.meta.updateTag({
          property: 'og:title',
          content: metaData.title ?? '',
        });
      } else {
        this.meta.addTag({
          property: 'og:title',
          content: metaData.title ?? '',
        });
      }
      if (this.meta.getTag("property='og:description'")) {
        this.meta.updateTag({
          property: 'og:description',
          content: metaData.description ?? '',
        });
      } else {
        this.meta.addTag({
          property: 'og:description',
          content: metaData.description ?? '',
        });
      }
      if (this.meta.getTag("property='og:image'")) {
        this.meta.updateTag({
          property: 'og:image',
          content: `${urlConfig.origin}/assets/logo/logo.png`,
        });
      } else {
        this.meta.addTag({
          property: 'og:image',
          content: `${urlConfig.origin}/assets/logo/logo.png`,
        });
      }
      // Twitter Card
      if (this.meta.getTag("name='twitter:card'")) {
        this.meta.updateTag({
          name: 'twitter:card',
          content: `summary_large_image`,
        });
      } else {
        this.meta.addTag({
          name: 'twitter:card',
          content: `summary_large_image`,
        });
      }
      if (this.meta.getTag("name='twitter:url'")) {
        this.meta.updateTag({
          name: 'twitter:url',
          content: `${urlConfig.origin}${urlConfig.pathname}`,
        });
      } else {
        this.meta.addTag({
          name: 'twitter:url',
          content: `${urlConfig.origin}${urlConfig.pathname}`,
        });
      }
      if (this.meta.getTag("name='twitter:title'")) {
        this.meta.updateTag({
          name: 'twitter:title',
          content: `${metaData.title ?? ''}`,
        });
      } else {
        this.meta.addTag({
          name: 'twitter:title',
          content: `${metaData.title ?? ''}`,
        });
      }
      if (this.meta.getTag("name='twitter:description'")) {
        this.meta.updateTag({
          name: 'twitter:description',
          content: `${metaData.description ?? ''}`,
        });
      } else {
        this.meta.addTag({
          name: 'twitter:description',
          content: `${metaData.description ?? ''}`,
        });
      }
      if (this.meta.getTag("name='twitter:image'")) {
        this.meta.updateTag({
          name: 'twitter:image',
          content: `${urlConfig.origin}/assets/logo/logo.png`,
        });
      } else {
        this.meta.updateTag({
          name: 'twitter:image',
          content: `${urlConfig.origin}/assets/logo/logo.png`,
        });
      }
      // Schema
      const schemaId = 'global-seo-schema';
      const obj = websiteSchema({
        appName: environment.app.name,
        url: urlConfig,
        description: metaData.description,
      });
      const existingSchema = this.doc.getElementById(schemaId);
      if (existingSchema) {
        existingSchema.innerText = JSON.stringify(obj);
      } else {
        const script = this.doc.createElement('script');
        script.id = schemaId;
        script.type = 'application/ld+json';
        script.innerText = JSON.stringify(obj);
        this.doc.head.appendChild(script);
      }
    } else {
      // Robots
      if (this.meta.getTag("name='robots'")) {
        this.meta.updateTag({
          name: 'robots',
          content: 'noindex, nofollow',
        });
      } else {
        this.meta.addTag({
          name: 'robots',
          content: 'noindex, nofollow',
        });
      }
    }
  }

  /**
   * Get meta data from API
   * Max API response time is 3s
   * Otherwise it will get terminated
   * @param rootId - Unique page id
   * @returns Observable<{ status: number; message: string; data: MetaData; }>
   */
  getMeta(rootId: string) {
    return this.httpClient.get<{
      status: number;
      message: string;
      data: MetaData;
    }>(`${this.apiPath}/api/global/seo/${rootId}`)
      .pipe(timeout(3000));
  }

  /**
   * Add or update canonical URL
   */
  loadCannonical() {
    const url = new URL(this.doc.URL);
    const generatedUrl = `${url.origin}${url.pathname}`;
    const head = this.doc.head;
    const links = head.getElementsByTagName('link');
    let isExists = false;
    let el = null;
    for (let i = 0; i < links.length; i++) {
      if (links[i].rel === 'canonical') {
        isExists = true;
        el = links[i];
        break;
      }
    }
    if (isExists && el) {
      el.href = generatedUrl;
    } else {
      const link = this.doc.createElement('link');
      link.rel = 'canonical';
      link.href = generatedUrl;
      head.appendChild(link);
    }
  }
}
