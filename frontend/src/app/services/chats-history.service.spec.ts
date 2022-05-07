/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatsHistoryService } from './chats-history.service';

describe('Service: ChatsHistory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatsHistoryService]
    });
  });

  it('should ...', inject([ChatsHistoryService], (service: ChatsHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
