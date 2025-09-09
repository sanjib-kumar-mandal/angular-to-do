import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWork } from './add-work';

describe('AddWork', () => {
  let component: AddWork;
  let fixture: ComponentFixture<AddWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWork]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWork);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
