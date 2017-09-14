import { TestBed, inject } from '@angular/core/testing';

import { OrganisationUnitsService } from './organisation-units.service';

describe('OrganisationUnitsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganisationUnitsService]
    });
  });

  it('should ...', inject([OrganisationUnitsService], (service: OrganisationUnitsService) => {
    expect(service).toBeTruthy();
  }));
});
