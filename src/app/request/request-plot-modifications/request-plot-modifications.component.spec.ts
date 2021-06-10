import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPlotModificationsComponent } from './request-plot-modifications.component';

describe('RequestPlotModificationsComponent', () => {
  let component: RequestPlotModificationsComponent;
  let fixture: ComponentFixture<RequestPlotModificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPlotModificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPlotModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
