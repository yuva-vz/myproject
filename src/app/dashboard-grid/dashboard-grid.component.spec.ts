import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGridComponent } from './dashboard-grid.component';

describe('DashboardGridComponent', () => {
  let component: DashboardGridComponent;
  let fixture: ComponentFixture<DashboardGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardGridComponent]
    });
    fixture = TestBed.createComponent(DashboardGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate 50 dashboard IDs', () => {
    expect(component.dashboards.length).toBe(50);
    expect(component.dashboards[0]).toBe(1);
    expect(component.dashboards[49]).toBe(50);
  });

  it('should track dashboards by ID', () => {
    expect(component.trackByDashboardId(0, 5)).toBe(5);
  });
});
