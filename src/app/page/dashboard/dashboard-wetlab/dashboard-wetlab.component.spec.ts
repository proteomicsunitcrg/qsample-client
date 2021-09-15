import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWetlabComponent } from './dashboard-wetlab.component';

describe('DashboardWetlabComponent', () => {
  let component: DashboardWetlabComponent;
  let fixture: ComponentFixture<DashboardWetlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardWetlabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWetlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
