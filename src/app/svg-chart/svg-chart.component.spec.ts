import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgChartComponent } from './svg-chart.component';

describe('SvgChartComponent', () => {
  let component: SvgChartComponent;
  let fixture: ComponentFixture<SvgChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SvgChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
