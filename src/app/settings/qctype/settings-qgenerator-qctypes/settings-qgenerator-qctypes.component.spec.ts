import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsQgeneratorQCtypesComponent } from './settings-qgenerator-qctypes.component';

describe('SettingsQgeneratorQCtypesComponent', () => {
  let component: SettingsQgeneratorQCtypesComponent;
  let fixture: ComponentFixture<SettingsQgeneratorQCtypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsQgeneratorQCtypesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsQgeneratorQCtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
