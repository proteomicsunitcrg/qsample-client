import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestPlotPlotComponent } from './request-plot-plot.component';

describe('RequestPlotPlotComponent', () => {
  let component: RequestPlotPlotComponent;
  let fixture: ComponentFixture<RequestPlotPlotComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestPlotPlotComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPlotPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
