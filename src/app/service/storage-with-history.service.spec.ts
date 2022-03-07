import { TestBed } from '@angular/core/testing';

import { StorageWithHistoryService } from './storage-with-history.service';

describe('StorageWithHistoryService', () => {
  let service: StorageWithHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageWithHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
