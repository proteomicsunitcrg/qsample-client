import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestWetlabMainComponent } from './request-wetlab-main.component';

describe('RequestWetlabMainComponent', () => {
  let component: RequestWetlabMainComponent;
  let fixture: ComponentFixture<RequestWetlabMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestWetlabMainComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWetlabMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
