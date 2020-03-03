import { TestBed } from '@angular/core/testing';

import { FuncionesService } from './funciones.service';

describe('FuncionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FuncionesService = TestBed.get(FuncionesService);
    expect(service).toBeTruthy();
  });
});
