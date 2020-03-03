import { TestBed } from '@angular/core/testing';

import { DbEleccionesService } from './db-elecciones.service';

describe('DbEleccionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbEleccionesService = TestBed.get(DbEleccionesService);
    expect(service).toBeTruthy();
  });
});
