import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPlotFileinfoComponent } from './request-plot-fileinfo.component';

describe('RequestPlotFileinfoComponent', () => {
  let component: RequestPlotFileinfoComponent;
  let fixture: ComponentFixture<RequestPlotFileinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPlotFileinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPlotFileinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
