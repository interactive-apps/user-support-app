import { TestBed, inject } from '@angular/core/testing';

import { TabsWorkflowService } from './tabs-workflow.service';

describe('TabsWorkflowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabsWorkflowService]
    });
  });

  it('should ...', inject([TabsWorkflowService], (service: TabsWorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
