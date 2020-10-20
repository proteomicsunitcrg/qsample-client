import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsQgeneratorApplicationsCreatorComponent } from './settings-qgenerator-applications-creator.component';

describe('SettingsQgeneratorApplicationsCreatorComponent', () => {
  let component: SettingsQgeneratorApplicationsCreatorComponent;
  let fixture: ComponentFixture<SettingsQgeneratorApplicationsCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsQgeneratorApplicationsCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsQgeneratorApplicationsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
