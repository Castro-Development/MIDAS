import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserApplicationReviewComponent } from './admin-user-application-review.component';

describe('AdminUserApplicationReviewComponent', () => {
  let component: AdminUserApplicationReviewComponent;
  let fixture: ComponentFixture<AdminUserApplicationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserApplicationReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserApplicationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
