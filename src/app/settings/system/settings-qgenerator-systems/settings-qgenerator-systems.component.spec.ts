import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsQgeneratorSystemsComponent } from './settings-qgenerator-systems.component';

describe('SettingsQgeneratorSystemsComponent', () => {
  let component: SettingsQgeneratorSystemsComponent;
  let fixture: ComponentFixture<SettingsQgeneratorSystemsComponent>;

  beforeEach(waitForAsync(() => {
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
