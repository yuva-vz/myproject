import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailDashboardComponent } from './thumbnail-dashboard.component';

describe('ThumbnailDashboardComponent', () => {
  let component: ThumbnailDashboardComponent;
  let fixture: ComponentFixture<ThumbnailDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThumbnailDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThumbnailDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
