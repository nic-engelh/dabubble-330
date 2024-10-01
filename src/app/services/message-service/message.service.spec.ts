import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { Firestore } from '@angular/fire/firestore';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Firestore],
    });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
