import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsQgeneratorMethodsCreatorComponent } from './settings-qgenerator-methods-creator.component';

describe('SettingsQgeneratorMethodsCreatorComponent', () => {
  let component: SettingsQgeneratorMethodsCreatorComponent;
  let fixture: ComponentFixture<SettingsQgeneratorMethodsCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsQgeneratorMethodsCreatorComponent ]
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
