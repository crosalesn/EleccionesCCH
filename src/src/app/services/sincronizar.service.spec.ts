import { TestBed } from '@angular/core/testing';

import { SincronizarService } from './sincronizar.service';

describe('SincronizarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SincronizarService = TestBed.get(SincronizarService);
    expect(service).toBeTruthy();
  });
});
