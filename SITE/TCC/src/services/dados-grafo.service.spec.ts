import { TestBed } from '@angular/core/testing';

import { DadosGrafoService } from './dados-grafo.service';

describe('DadosGrafoService', () => {
  let service: DadosGrafoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DadosGrafoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
