import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { MiniChart } from './mini-chart.class';

@Component({
  selector: 'app-mini-dashboard',
  templateUrl: './mini-dashboard.component.html',
  styleUrls: ['./mini-dashboard.component.scss']
})
export class MiniDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('miniChartContainer', { static: false }) miniChartRef!: ElementRef<HTMLDivElement>;
  @Input() chartsData: any[] = [];
  
  private miniChart!: MiniChart;

  // Default charts data for demonstration
  defaultChartsData: any[] = [
    {
      type: 'bar',
      title: 'Sales',
      data: [10, 20, 15, 25, 30],
      position: { x: 0, y: 0, width: 30, height: 25 }
    },
    {
      type: 'pie',
      title: 'Users',
      data: [40, 30, 20, 10],
      position: { x: 35, y: 0, width: 25, height: 25 }
    },
    {
      type: 'line',
      title: 'Growth',
      data: [5, 10, 8, 15, 12, 18, 20],
      position: { x: 65, y: 0, width: 35, height: 25 }
    },
    {
      type: 'donut',
      title: 'Categories',
      data: [25, 35, 15, 25],
      position: { x: 0, y: 30, width: 25, height: 25 }
    },
    {
      type: 'area',
      title: 'Revenue',
      data: [100, 120, 110, 140, 160, 180, 200],
      position: { x: 30, y: 30, width: 35, height: 25 }
    },
    {
      type: 'card',
      title: 'Total',
      data: ['1,234'],
      position: { x: 70, y: 30, width: 30, height: 25 }
    }
  ];

  ngAfterViewInit(): void {
    this.initializeMiniChart();
  }

  ngOnDestroy(): void {
    if (this.miniChart) {
      this.miniChart.destroy();
    }
  }

  private initializeMiniChart(): void {
    const dataToUse = this.chartsData.length > 0 ? this.chartsData : this.defaultChartsData;
    this.miniChart = new MiniChart(this.miniChartRef, dataToUse);
  }

  public refreshMiniCharts(): void {
    if (this.miniChart) {
      this.miniChart.render();
    }
  }

  public updateChartsData(newData: any[]): void {
    if (this.miniChart) {
      this.miniChart.updateData(newData);
    }
  }
}
