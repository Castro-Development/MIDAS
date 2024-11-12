import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersChartComponent } from './admin-users-chart.component';

describe('AdminUsersChartComponent', () => {
  let component: AdminUsersChartComponent;
  let fixture: ComponentFixture<AdminUsersChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUsersChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUsersChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
