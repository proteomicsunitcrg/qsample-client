import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsQgeneratorApplicationsComponent } from './settings-qgenerator-applications.component';

describe('SettingsQgeneratorApplicationsComponent', () => {
  let component: SettingsQgeneratorApplicationsComponent;
  let fixture: ComponentFixture<SettingsQgeneratorApplicationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsQgeneratorApplicationsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsQgeneratorApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
