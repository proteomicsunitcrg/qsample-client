import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsQgeneratorMethodsCreatorComponent } from './settings-qgenerator-methods-creator.component';

describe('SettingsQgeneratorMethodsCreatorComponent', () => {
  let component: SettingsQgeneratorMethodsCreatorComponent;
  let fixture: ComponentFixture<SettingsQgeneratorMethodsCreatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsQgeneratorMethodsCreatorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsQgeneratorMethodsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
