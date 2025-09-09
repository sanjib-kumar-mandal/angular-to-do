import { Component, inject, OnInit } from '@angular/core';
import {
  KageBreadCrumbs,
  KageBreadCrumb,
  KageButton,
  KageModalCtrl,
  KageAlertCtrl,
  KageToastCtrl,
} from 'kage-ui';
import { AddWork } from './add-work/add-work';
import { RouterLink } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { LoaderService } from '@services/loader/loader.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-dashboard',
  imports: [KageBreadCrumbs, KageBreadCrumb, KageButton, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [DashboardService],
})
export class Dashboard implements OnInit {
  // Injectable
  private readonly modalCtrl = inject(KageModalCtrl);
  private readonly dashboardService = inject(DashboardService);
  private readonly loaderService = inject(LoaderService);
  private readonly alertCtrl = inject(KageAlertCtrl);
  private readonly toastCtrl = inject(KageToastCtrl);
  // Local variabls
  workList: Array<any> | undefined;
  isLoading: boolean = false;
  pageNo: number = 1;

  constructor() {
    this.getWorks(this.pageNo);
  }

  ngOnInit(): void {
    this.loaderService.loader$.pipe(untilDestroyed(this)).subscribe({
      next: (isLoading) => (this.isLoading = isLoading),
    });
  }

  getWorks(page: number) {
    if (!this.isLoading) {
      this.pageNo = page;
      this.dashboardService
        .getWorks(page)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (data: any) => {
            this.workList = data.data;
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  addWork() {
    const ref = this.modalCtrl.open(AddWork);
    ref.onDestroy(() => this.getWorks(this.pageNo));
  }

  async deleteWork(id: number) {
    const ref = await this.alertCtrl.show({
      message: 'Are you sure you want to delete?',
      title: 'Delete!!',
      buttons: [
        { label: 'Yes', role: 'confirm', color: 'success' },
        { label: 'No', role: 'cancel', color: 'danger' },
      ],
    });
    if (ref.button?.role === 'confirm') {
      this.dashboardService
        .deleteWork(id)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (_) => {
            this.getWorks(this.pageNo);
            this.toastCtrl.show({
              message: 'Deleted',
              duration: 2500,
              position: 'top-right',
              type: 'success',
            });
          },
          error: () => {
            this.toastCtrl.show({
              message: 'Failed to delete',
              duration: 2500,
              position: 'top-right',
              type: 'danger',
            });
          },
        });
    }
  }
}
