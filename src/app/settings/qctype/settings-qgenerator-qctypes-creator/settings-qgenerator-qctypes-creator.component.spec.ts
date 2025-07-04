import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsQgeneratorQCtypesCreatorComponent } from './settings-qgenerator-qctypes-creator.component';

describe('SettingsQgeneratorQCtypesCreatorComponent', () => {
  let component: SettingsQgeneratorQCtypesCreatorComponent;
  let fixture: ComponentFixture<SettingsQgeneratorQCtypesCreatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsQgeneratorQCtypesCreatorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsQgeneratorQCtypesCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
