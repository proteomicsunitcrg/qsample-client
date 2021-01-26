import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WetlabPlotComponent } from './wetlab-plot.component';

describe('WetlabPlotComponent', () => {
  let component: WetlabPlotComponent;
  let fixture: ComponentFixture<WetlabPlotComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WetlabPlotComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WetlabPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
