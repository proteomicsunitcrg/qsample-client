import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMainComponent } from './request-main.component';

describe('RequestMainComponent', () => {
  let component: RequestMainComponent;
  let fixture: ComponentFixture<RequestMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
