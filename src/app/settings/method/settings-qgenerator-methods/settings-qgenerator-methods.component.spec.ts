import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsQgeneratorMethodsComponent } from './settings-qgenerator-methods.component';

describe('SettingsQgeneratorMethodsComponent', () => {
  let component: SettingsQgeneratorMethodsComponent;
  let fixture: ComponentFixture<SettingsQgeneratorMethodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsQgeneratorMethodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsQgeneratorMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
