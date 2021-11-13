import { TestBed } from '@angular/core/testing';

import { ExistsNoteGuard } from './exists-note.guard';

describe('ExistsNoteGuard', () => {
  let guard: ExistsNoteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ExistsNoteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
