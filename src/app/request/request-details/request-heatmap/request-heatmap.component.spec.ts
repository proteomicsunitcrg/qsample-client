import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestHeatmapComponent } from './request-heatmap.component';

describe('RequestHeatmapComponent', () => {
  let component: RequestHeatmapComponent;
  let fixture: ComponentFixture<RequestHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestHeatmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
