import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRequestNextflowComponent } from './dashboard-request-nextflow.component';

describe('DashboardRequestNextflowComponent', () => {
  let component: DashboardRequestNextflowComponent;
  let fixture: ComponentFixture<DashboardRequestNextflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardRequestNextflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRequestNextflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
