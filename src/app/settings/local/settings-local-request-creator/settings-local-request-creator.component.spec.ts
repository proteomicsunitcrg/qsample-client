import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLocalRequestCreatorComponent } from './settings-local-request-creator.component';

describe('SettingsLocalRequestCreatorComponent', () => {
  let component: SettingsLocalRequestCreatorComponent;
  let fixture: ComponentFixture<SettingsLocalRequestCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsLocalRequestCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLocalRequestCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
