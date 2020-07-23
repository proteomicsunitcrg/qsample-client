import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPlotRequestComponent } from './request-plot-request.component';

describe('RequestPlotRequestComponent', () => {
  let component: RequestPlotRequestComponent;
  let fixture: ComponentFixture<RequestPlotRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPlotRequestComponent ]
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
