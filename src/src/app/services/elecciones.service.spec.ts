import { TestBed } from '@angular/core/testing';

import { EleccionesService } from './elecciones.service';

describe('EleccionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EleccionesService = TestBed.get(EleccionesService);
    expect(service).toBeTruthy();
  });
});
