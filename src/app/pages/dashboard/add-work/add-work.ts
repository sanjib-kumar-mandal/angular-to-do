import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  KageButton,
  KageInput,
  KageModalCtrl,
  KageTextarea,
  KageToastCtrl,
} from 'kage-ui';
import { DashboardService } from '../dashboard.service';
import { LoaderService } from '@services/loader/loader.service';

@Component({
  selector: 'app-add-work',
  imports: [
    KageButton,
    KageInput,
    KageTextarea,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-work.html',
  styleUrl: './add-work.scss',
  providers: [DashboardService],
})
export class AddWork implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dashboardService = inject(DashboardService);
  private readonly toastCtrl = inject(KageToastCtrl);
  private readonly modalCtrl = inject(KageModalCtrl);
  private readonly loaderService = inject(LoaderService);
  // Local variable
  formGroup!: FormGroup;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loaderService.loader$.subscribe({
      next: (isLoading) => (this.isLoading = isLoading),
    });
    this.formGroup = this.formBuilder.group({
      Title: ['', Validators.compose([Validators.required])],
      Description: ['', Validators.compose([Validators.required])],
    });
  }

  addNewWork() {
    if (this.formGroup.valid) {
      this.dashboardService.addWork(this.formGroup.value).subscribe({
        next: (data: any) => {
          this.toastCtrl.show({
            message: 'Added',
            duration: 2500,
            position: 'top-right',
            type: 'success',
          });
          this.modalCtrl.close();
        },
        error: (error) => {
          console.log(error);
          this.toastCtrl.show({
            message: error.error.detail,
            duration: 2500,
            position: 'top-right',
            type: 'danger',
          });
        },
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
