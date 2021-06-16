import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteTableComponent } from './favorite-table.component';

describe('FavoriteTableComponent', () => {
  let component: FavoriteTableComponent;
  let fixture: ComponentFixture<FavoriteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
