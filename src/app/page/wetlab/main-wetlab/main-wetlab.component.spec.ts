import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainWetlabComponent } from './main-wetlab.component';

describe('MainWetlabComponent', () => {
  let component: MainWetlabComponent;
  let fixture: ComponentFixture<MainWetlabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainWetlabComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWetlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
