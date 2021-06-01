import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPcaComponent } from './request-pca.component';

describe('RequestPcaComponent', () => {
  let component: RequestPcaComponent;
  let fixture: ComponentFixture<RequestPcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPcaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
