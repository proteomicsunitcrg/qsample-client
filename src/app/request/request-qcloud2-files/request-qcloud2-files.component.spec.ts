import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestQcloud2FilesComponent } from './request-qcloud2-files.component';

describe('RequestQcloud2FilesComponent', () => {
  let component: RequestQcloud2FilesComponent;
  let fixture: ComponentFixture<RequestQcloud2FilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestQcloud2FilesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestQcloud2FilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
