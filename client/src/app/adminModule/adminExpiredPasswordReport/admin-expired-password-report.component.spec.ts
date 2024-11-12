import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExpiredPasswordReportComponent } from './admin-expired-password-report.component';

describe('AdminExpiredPasswordReportComponent', () => {
  let component: AdminExpiredPasswordReportComponent;
  let fixture: ComponentFixture<AdminExpiredPasswordReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminExpiredPasswordReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminExpiredPasswordReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
