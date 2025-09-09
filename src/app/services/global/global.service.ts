import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  GenderModel,
  ProjectModel,
  Currency,
  NPSModes,
  PromotionPositionModel,
  PlanModel,
} from './global.model';
import { HttpClient } from '@angular/common/http';
import { API_BASE_PATH } from '@utils/tokens';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  // Injectors
  private httpClient = inject(HttpClient);
  private apiPath = inject(API_BASE_PATH);
  // Global States
  private currentOrg: BehaviorSubject<ProjectModel> =
    new BehaviorSubject<ProjectModel>(null!);

  get project() {
    return {
      setProject: (data: ProjectModel) => this.currentOrg.next(data),
      getProject: () => this.currentOrg.asObservable(),
      clear: () => this.currentOrg.next(null!),
      setProjectById: (id: string) => {
        this.httpClient
          .get(`${this.apiPath}/api/dashboard/project/${id}`)
          .subscribe({
            next: (data: any) => this.currentOrg.next(data.data),
            error: (_) => this.currentOrg.next(null!),
          });
      },
    };
  }

  get generalApi() {
    return {
      gender: () =>
        this.httpClient.get<{
          status: number;
          message: string;
          data: Array<GenderModel>;
        }>(`${this.apiPath}/api/global/genders`),
      promotionPositions: () =>
        this.httpClient.get<{
          status: number;
          message: string;
          data: Array<PromotionPositionModel>;
        }>(`${this.apiPath}/api/global/promotion-positions`),
      currencies: () =>
        this.httpClient.get<{
          status: number;
          message: string;
          data: Array<Currency>;
        }>(`${this.apiPath}/api/global/currencies`),
      npsModes: () =>
        this.httpClient.get<{
          status: number;
          message: string;
          data: Array<NPSModes>;
        }>(`${this.apiPath}/api/global/nps-modes`),
      getPlans: () =>
        this.httpClient.get<{
          status: number;
          message: string;
          data: Array<PlanModel>;
        }>(`${this.apiPath}/api/global/plans`),
    };
  }
}
