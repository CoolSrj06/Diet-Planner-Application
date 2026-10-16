import { TestBed } from '@angular/core/testing';

import { DietplanrequestService } from './dietplanrequest.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DietplanrequestService', () => {
  let service: DietplanrequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DietplanrequestService);
  });

  fit('Frontend_should_create_dietplanrequest_service', () => {
    expect(service).toBeTruthy();
  });
});
