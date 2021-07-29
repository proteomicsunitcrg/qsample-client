import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDendogramComponent } from './request-dendogram.component';

describe('RequestDendogramComponent', () => {
  let component: RequestDendogramComponent;
  let fixture: ComponentFixture<RequestDendogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestDendogramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDendogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
