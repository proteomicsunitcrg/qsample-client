import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WetlabDetailsComponent } from './wetlab-details.component';

describe('WetlabDetailsComponent', () => {
  let component: WetlabDetailsComponent;
  let fixture: ComponentFixture<WetlabDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WetlabDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WetlabDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
