import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsQgeneratorSystemsQcComponent } from './settings-qgenerator-systems-qc.component';

describe('SettingsQgeneratorSystemsQcComponent', () => {
  let component: SettingsQgeneratorSystemsQcComponent;
  let fixture: ComponentFixture<SettingsQgeneratorSystemsQcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsQgeneratorSystemsQcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsQgeneratorSystemsQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
