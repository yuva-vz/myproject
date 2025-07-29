import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCanvasDashboardComponent } from './grid-canvas-dashboard.component';

describe('GridCanvasDashboardComponent', () => {
  let component: GridCanvasDashboardComponent;
  let fixture: ComponentFixture<GridCanvasDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridCanvasDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridCanvasDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
