import { TestBed } from '@angular/core/testing';

import { JavascriptUtilService } from './javascript-util.service';

describe('JavascriptUtilService', () => {
  let service: JavascriptUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JavascriptUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
