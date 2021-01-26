import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WetlabMainComponent } from './wetlab-main.component';

describe('WetlabMainComponent', () => {
  let component: WetlabMainComponent;
  let fixture: ComponentFixture<WetlabMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WetlabMainComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WetlabMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
