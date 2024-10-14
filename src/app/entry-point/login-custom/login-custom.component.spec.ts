import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginCustomComponent } from './login-custom.component';

describe('LoginCustomComponent', () => {
  let component: LoginCustomComponent;
  let fixture: ComponentFixture<LoginCustomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginCustomComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
