import { TestBed } from '@angular/core/testing';

import { AccountantGuardService } from './accountant-guard.service';

describe('AccountantGuardService', () => {
  let service: AccountantGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountantGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
