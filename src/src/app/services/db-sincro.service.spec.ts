import { TestBed } from '@angular/core/testing';

import { DbSincroService } from './db-sincro.service';

describe('DbSincroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbSincroService = TestBed.get(DbSincroService);
    expect(service).toBeTruthy();
  });
});
