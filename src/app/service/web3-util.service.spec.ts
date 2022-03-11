import { TestBed } from '@angular/core/testing';

import { Web3UtilService } from './web3-util.service';

describe('Web3UtilService', () => {
  let service: Web3UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
