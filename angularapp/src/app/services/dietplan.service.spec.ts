import { TestBed } from '@angular/core/testing';

import { DietplanService } from './dietplan.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DietplanService', () => {
  let service: DietplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DietplanService);
  });

  fit('Frontend_should_create_dietplan_service', () => {
    expect(service).toBeTruthy();
  });
});
