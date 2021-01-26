import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestQueueGeneratorComponent } from './request-queue-generator.component';

describe('RequestQueueGeneratorComponent', () => {
  let component: RequestQueueGeneratorComponent;
  let fixture: ComponentFixture<RequestQueueGeneratorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestQueueGeneratorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestQueueGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
