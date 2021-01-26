import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WetlabListComponent } from './wetlab-list.component';

describe('WetlabListComponent', () => {
  let component: WetlabListComponent;
  let fixture: ComponentFixture<WetlabListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WetlabListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WetlabListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
