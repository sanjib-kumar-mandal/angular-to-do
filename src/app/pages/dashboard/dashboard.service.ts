import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_PATH } from '@utils/tokens';

@Injectable()
export class DashboardService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBasePath = inject(API_BASE_PATH);

  // ====================== WORKS ======================== //
  getWorks(page: number, pageSize: number = 10) {
    return this.httpClient.get(`${this.apiBasePath}/Api/Works/GetWorks`, {
      params: {
        page,
        pageSize,
      },
    });
  }

  getWorkDetails(id: string) {
    return this.httpClient.get(
      `${this.apiBasePath}/Api/Works/GetWorkDetails/${id}`
    );
  }

  addWork(data: any) {
    return this.httpClient.post(`${this.apiBasePath}/Api/Works/AddWorks`, data);
  }

  deleteWork(workId: number) {
    return this.httpClient.delete(
      `${this.apiBasePath}/Api/Works/DeleteWorks/${workId}`
    );
  }

  // ======================== TASKS ======================== //
  addTask(workId: number | string, data: any) {
    return this.httpClient.post(
      `${this.apiBasePath}/Api/Tasks/${workId}/AddNewTask`,
      data
    );
  }

  getTasks(workId: string | number) {
    return this.httpClient.get(
      `${this.apiBasePath}/Api/Tasks/${workId}/GetTasks`
    );
  }

  updateTaskStatus(
    workId: string | number,
    taskId: string | number,
    status: string
  ) {
    return this.httpClient.put(
      `${this.apiBasePath}/Api/Tasks/${workId}/UpdateStatus/${taskId}`,
      {
        status,
      }
    );
  }
}
