import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserApplicationsComponent } from './admin-user-applications.component';

describe('AdminUserApplicationsComponent', () => {
  let component: AdminUserApplicationsComponent;
  let fixture: ComponentFixture<AdminUserApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
