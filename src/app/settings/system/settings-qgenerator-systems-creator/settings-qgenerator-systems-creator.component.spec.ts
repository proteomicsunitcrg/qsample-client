import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsQgeneratorSystemsCreatorComponent } from './settings-qgenerator-systems-creator.component';

describe('SettingsQgeneratorSystemsCreatorComponent', () => {
  let component: SettingsQgeneratorSystemsCreatorComponent;
  let fixture: ComponentFixture<SettingsQgeneratorSystemsCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsQgeneratorSystemsCreatorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsQgeneratorSystemsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
