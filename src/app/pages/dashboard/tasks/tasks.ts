import { Component, inject, input, OnInit } from '@angular/core';
import {
  KageAlertCtrl,
  KageBreadCrumb,
  KageBreadCrumbs,
  KageToastCtrl,
} from 'kage-ui';
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DashboardService } from '../dashboard.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Logger } from '@utils/logger';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-tasks',
  imports: [
    KageBreadCrumbs,
    KageBreadCrumb,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
  providers: [DashboardService],
})
export class Tasks implements OnInit {
  // Input
  id = input.required<string>();
  // Injectable
  private readonly dashboardService = inject(DashboardService);
  private readonly alertCtrl = inject(KageAlertCtrl);
  private readonly toastCtrl = inject(KageToastCtrl);
  // Local variables
  workDetails: any;
  reorderGroup: any = {
    open: [],
    active: [],
    halt: [],
    rejected: [],
    completed: [],
  };

  ngOnInit(): void {
    this.getWorkDetails();
    this.getTaskDetails();
  }

  private getTaskDetails() {
    this.dashboardService.getTasks(this.id()).subscribe({
      next: (data: any) => {
        const allData = data.data;
        // Find open tasks
        this.reorderGroup.open =
          allData.find((el: any) => el.status === 'Open')?.list ?? [];
        // Find active task
        this.reorderGroup.active =
          allData.find((el: any) => el.status === 'Active')?.list ?? [];
        // Find completed task
        this.reorderGroup.completed =
          allData.find((el: any) => el.status === 'Completed')?.list ?? [];
        // Find halted task
        this.reorderGroup.halt =
          allData.find((el: any) => el.status === 'Halt')?.list ?? [];
        // Find completed task
        this.reorderGroup.rejected =
          allData.find((el: any) => el.status === 'Rejected')?.list ?? [];
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getWorkDetails() {
    this.dashboardService
      .getWorkDetails(this.id())
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.workDetails = data.data;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  drop(event: CdkDragDrop<any>, dropArea: string) {
    console.log('dropArea', dropArea, 'Item', event.item.data);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.dashboardService
      .updateTaskStatus(this.id(), event.item.data.id, dropArea)
      .subscribe({
        next: (data) => {
          console.log('Updated', data);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  async addNewTask() {
    try {
      const ref = await this.alertCtrl.show({
        title: 'Task add',
        message: 'Add new task',
        inputs: [{ name: 'title', label: 'Task name', type: 'text' }],
        buttons: [
          { label: 'Add', color: 'success', role: 'confirm' },
          { label: 'Cancel', color: 'danger', role: 'cancel' },
        ],
      });
      if (ref.button?.role === 'confirm') {
        const value = ref.values;
        this.dashboardService.addTask(this.id(), value).subscribe({
          next: (data) => {
            this.getTaskDetails();
          },
          error: (error) => {
            this.toastCtrl.show({
              message: 'Failed to add task',
              duration: 2500,
              position: 'top-right',
              type: 'danger',
            });
          },
        });
      }
    } catch (e) {
      Logger.log(e);
    }
  }
}
