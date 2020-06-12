import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidesetMainComponent } from './guideset-main.component';

describe('GuidesetMainComponent', () => {
  let component: GuidesetMainComponent;
  let fixture: ComponentFixture<GuidesetMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidesetMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidesetMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
