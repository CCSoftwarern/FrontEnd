import { TestBed } from '@angular/core/testing';

import { ApibancoService } from './apibanco.service';

describe('ApibancoService', () => {
  let service: ApibancoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApibancoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
