import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteSidebarComponent } from './favorite-sidebar.component';

describe('FavoriteSidebarComponent', () => {
  let component: FavoriteSidebarComponent;
  let fixture: ComponentFixture<FavoriteSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
