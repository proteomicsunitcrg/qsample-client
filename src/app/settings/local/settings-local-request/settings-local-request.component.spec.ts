import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLocalRequestComponent } from './settings-local-request.component';

describe('SettingsLocalRequestComponent', () => {
  let component: SettingsLocalRequestComponent;
  let fixture: ComponentFixture<SettingsLocalRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsLocalRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLocalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
