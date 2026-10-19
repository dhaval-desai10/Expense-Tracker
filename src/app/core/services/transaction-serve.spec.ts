import { TestBed } from '@angular/core/testing';
import { TransactionServe } from './transaction-serve';

describe('TransactionServe', () => {
  let service: TransactionServe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionServe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
