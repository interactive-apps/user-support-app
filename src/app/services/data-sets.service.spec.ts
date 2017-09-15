import { TestBed, inject } from '@angular/core/testing';

import { DataSetsService } from './data-sets.service';

describe('DataSetsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataSetsService]
    });
  });

  it('should ...', inject([DataSetsService], (service: DataSetsService) => {
    expect(service).toBeTruthy();
  }));
});
