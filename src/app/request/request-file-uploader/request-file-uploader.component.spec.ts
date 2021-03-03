import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFileUploaderComponent } from './request-file-uploader.component';

describe('RequestFileUploaderComponent', () => {
  let component: RequestFileUploaderComponent;
  let fixture: ComponentFixture<RequestFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestFileUploaderComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
