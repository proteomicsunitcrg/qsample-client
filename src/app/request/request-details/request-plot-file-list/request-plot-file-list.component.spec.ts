import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestPlotFileListComponent } from './request-plot-file-list.component';

describe('RequestPlotFileListComponent', () => {
  let component: RequestPlotFileListComponent;
  let fixture: ComponentFixture<RequestPlotFileListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestPlotFileListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPlotFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
