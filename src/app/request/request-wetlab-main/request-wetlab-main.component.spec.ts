import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWetlabMainComponent } from './request-wetlab-main.component';

describe('RequestWetlabMainComponent', () => {
  let component: RequestWetlabMainComponent;
  let fixture: ComponentFixture<RequestWetlabMainComponent>;

  beforeEach(async(() => {
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
