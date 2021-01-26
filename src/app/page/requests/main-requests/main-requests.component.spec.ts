import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainRequestsComponent } from './main-requests.component';

describe('MainRequestsComponent', () => {
  let component: MainRequestsComponent;
  let fixture: ComponentFixture<MainRequestsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainRequestsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
