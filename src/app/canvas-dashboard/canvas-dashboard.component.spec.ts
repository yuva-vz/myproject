import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasDashboardComponent } from './canvas-dashboard.component';

describe('CanvasDashboardComponent', () => {
  let component: CanvasDashboardComponent;
  let fixture: ComponentFixture<CanvasDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanvasDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CanvasDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
