import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit {
  @Input() data: number[] = [30, 25, 20, 15, 10];
  @Input() width = 250;
  @Input() height = 250;
  @Input() title = 'Pie Chart';
  @Input() colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  
  @ViewChild('pieChart', { static: true }) pieChartRef!: ElementRef<SVGElement>;

  ngAfterViewInit() {
    this.renderPieChart();
  }

  renderPieChart() {
    const svg = this.pieChartRef.nativeElement;
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) / 2 - 20;
    const total = this.data.reduce((sum, value) => sum + value, 0);
    
    if (total <= 0) return;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    let startAngle = 0;
    this.data.forEach((value, index) => {
      if (isNaN(value) || value <= 0) return;
      
      const sliceAngle = (value / total) * 2 * Math.PI;
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(startAngle + sliceAngle);
      const y2 = centerY + radius * Math.sin(startAngle + sliceAngle);
      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      
      const pathData = [
        `M ${centerX},${centerY}`,
        `L ${x1},${y1}`,
        `A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}`,
        'Z'
      ].join(' ');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', this.colors[index % this.colors.length]);
      path.setAttribute('stroke', 'white');
      path.setAttribute('stroke-width', '2');
      svg.appendChild(path);
      
      startAngle += sliceAngle;
    });
  }
}
