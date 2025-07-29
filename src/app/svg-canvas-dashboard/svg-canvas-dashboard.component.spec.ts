import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCanvasDashboardComponent } from './svg-canvas-dashboard.component';

describe('SvgCanvasDashboardComponent', () => {
  let component: SvgCanvasDashboardComponent;
  let fixture: ComponentFixture<SvgCanvasDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgCanvasDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SvgCanvasDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
