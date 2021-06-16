import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteMainComponent } from './favorite-main.component';

describe('FavoriteMainComponent', () => {
  let component: FavoriteMainComponent;
  let fixture: ComponentFixture<FavoriteMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
