import { TestBed } from '@angular/core/testing';

import { ConversationListService } from './conversation-list.service';

describe('ConversationListService', () => {
  let service: ConversationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
