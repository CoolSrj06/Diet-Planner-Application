import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RequestedplanComponent } from './requestedplan.component';

describe('RequestedplanComponent', () => {
  let component: RequestedplanComponent;
  let fixture: ComponentFixture<RequestedplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ RequestedplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_requestedplan_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_diet_plan_requests_for_approval_heading_in_the_requestedplan_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Diet Plan Requests for Approval');
  });
});
