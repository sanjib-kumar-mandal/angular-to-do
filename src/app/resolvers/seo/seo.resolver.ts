import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SeoService } from '@services/seo/seo.service';
import { Logger } from '@utils/logger';
import { firstValueFrom } from 'rxjs';

export const seoResolver = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot
) => {
  try {
    // Get SEOService
    const seoService = inject(SeoService);
    // Get page data
    const rootId = (route.data as any).rootId;
    // Check if page data exists
    if (rootId) {
      // Initially load canonical URL
      seoService.loadCannonical();
      // Get Meta data from API
      const routeMeta = await firstValueFrom(seoService.getMeta(rootId));
      // Load meta data to the DOM
      seoService.loadMeta(routeMeta.data);
    }
  } catch (e) {
    Logger.log('SEO resolver error', e);
  }
};
