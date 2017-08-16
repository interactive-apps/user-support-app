import { TestBed, inject } from '@angular/core/testing';

import { MessageConversationService } from './message-conversation.service';

describe('MessageConversationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageConversationService]
    });
  });

  it('should ...', inject([MessageConversationService], (service: MessageConversationService) => {
    expect(service).toBeTruthy();
  }));
});
