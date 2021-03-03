import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestQuantificationComponent } from './request-quantification.component';

describe('RequestQuantificationComponent', () => {
  let component: RequestQuantificationComponent;
  let fixture: ComponentFixture<RequestQuantificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestQuantificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestQuantificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
