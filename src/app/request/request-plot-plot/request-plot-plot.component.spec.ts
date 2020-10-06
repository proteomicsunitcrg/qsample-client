import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPlotPlotComponent } from './request-plot-plot.component';

describe('RequestPlotPlotComponent', () => {
  let component: RequestPlotPlotComponent;
  let fixture: ComponentFixture<RequestPlotPlotComponent>;

  beforeEach(async(() => {
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
