import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsAddUserComponent } from './settings-adduser.component';

describe('SettingsAddUserComponent', () => {
  let component: SettingsAddUserComponent;
  let fixture: ComponentFixture<SettingsAddUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsAddUserComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
