import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSystemAccessComponent } from './request-system-access.component';

describe('RequestSystemAccessComponent', () => {
  let component: RequestSystemAccessComponent;
  let fixture: ComponentFixture<RequestSystemAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestSystemAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestSystemAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
