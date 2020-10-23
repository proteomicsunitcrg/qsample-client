import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsQgeneratorSystemsComponent } from './settings-qgenerator-systems.component';

describe('SettingsQgeneratorSystemsComponent', () => {
  let component: SettingsQgeneratorSystemsComponent;
  let fixture: ComponentFixture<SettingsQgeneratorSystemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsQgeneratorSystemsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsQgeneratorSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
