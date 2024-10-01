import { TestBed } from '@angular/core/testing';

import { MessagingService } from './messaging.service';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [Firestore, Auth],
    });
    service = TestBed.inject(MessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
