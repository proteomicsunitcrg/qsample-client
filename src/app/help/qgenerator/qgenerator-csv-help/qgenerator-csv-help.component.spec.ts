import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QgeneratorCsvHelpComponent } from './qgenerator-csv-help.component';

describe('QgeneratorCsvHelpComponent', () => {
  let component: QgeneratorCsvHelpComponent;
  let fixture: ComponentFixture<QgeneratorCsvHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QgeneratorCsvHelpComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QgeneratorCsvHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
