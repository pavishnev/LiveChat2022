/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AgentsAuthService } from './agents-auth.service';

describe('Service: AgentsAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgentsAuthService]
    });
  });

  it('should ...', inject([AgentsAuthService], (service: AgentsAuthService) => {
    expect(service).toBeTruthy();
  }));
});
