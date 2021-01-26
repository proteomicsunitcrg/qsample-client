import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestDetailsPanelComponent } from './request-details-panel.component';

describe('RequestDetailsPanelComponent', () => {
  let component: RequestDetailsPanelComponent;
  let fixture: ComponentFixture<RequestDetailsPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestDetailsPanelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
