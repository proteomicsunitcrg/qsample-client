import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestPlotRequestComponent } from './request-plot-request.component';

describe('RequestPlotRequestComponent', () => {
  let component: RequestPlotRequestComponent;
  let fixture: ComponentFixture<RequestPlotRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestPlotRequestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPlotRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
