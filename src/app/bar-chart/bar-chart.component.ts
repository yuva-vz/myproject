import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements AfterViewInit {
  @Input() data: number[] = [15, 8, 7, 7, 6, 6, 6, 5, 5, 4];
  @Input() width = 300;
  @Input() height = 200;
  @Input() title = 'Bar Chart';
  @Input() colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  
  @ViewChild('barChart', { static: true }) barChartRef!: ElementRef<SVGElement>;

  ngAfterViewInit() {
    this.renderBarChart();
  }

  renderBarChart() {
    const svg = this.barChartRef.nativeElement;
    const padding = { left: 40, right: 20, top: 30, bottom: 40 };
    const chartWidth = this.width - padding.left - padding.right;
    const chartHeight = this.height - padding.top - padding.bottom;
    
    if (chartWidth <= 0 || chartHeight <= 0) return;
    
    const barWidth = chartWidth / this.data.length - 10;
    const maxValue = Math.max(...this.data);
    
    if (maxValue <= 0) return;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Create bars
    this.data.forEach((value, index) => {
      if (isNaN(value) || value < 0) return;
      
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding.left + index * (barWidth + 10);
      const y = this.height - padding.bottom - barHeight;
      
      // Create rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', this.colors[index % this.colors.length]);
      rect.setAttribute('rx', '4');
      svg.appendChild(rect);

      // Add value labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (x + barWidth / 2).toString());
      text.setAttribute('y', (y - 5).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#333');
      text.textContent = value.toString();
      svg.appendChild(text);
    });
  }
}
