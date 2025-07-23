import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-charts',
  templateUrl: './card-charts.component.html',
  styleUrls: ['./card-charts.component.scss']
})
export class CardChartsComponent implements OnInit {

  // Simplified layout for card display
  layoutPositions = [
    // Top row - smaller charts for card
    { type: 'pie', position: { h: '40%', w: '30%', x: '5%', y: '10%' } },
    { type: 'bar', position: { h: '40%', w: '30%', x: '38%', y: '10%' } },
    { type: 'card', position: { h: '18%', w: '25%', x: '72%', y: '10%' } },
    { type: 'card', position: { h: '18%', w: '25%', x: '72%', y: '32%' } },
    
    // Bottom row
    { type: 'bar', position: { h: '35%', w: '92%', x: '5%', y: '60%' } },
  ];

  chartInfo = [
    { type: 'pie', title: 'Distribution', data: [30, 25, 20, 15, 10] },
    { type: 'bar', title: 'Stats', data: [15, 8, 7, 7, 6, 6, 6, 5] },
    { type: 'card', title: '4772', data: [4772] },
    { type: 'card', title: '4772', data: [4772] },
    { type: 'bar', title: 'Overview', data: [15, 8, 7, 7, 6, 6, 6, 5, 5, 4, 3] },
  ];

  layoutData = this.layoutPositions.map((layoutItem) => {
    const type = layoutItem.type;
    const chart = this.chartInfo.find(c => c.type === type);
    
    return {
      type,
      position: layoutItem.position,
      title: chart?.title || '',
      data: chart?.data || [],
    };
  });

  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

  ngOnInit() {
    setTimeout(() => {
      this.renderAllCharts();
    }, 100);
  }

  renderAllCharts() {
    this.layoutData.forEach((chart, index) => {
      const id = `card-chart-${chart.type}-${index}`;
      const svgElement = document.getElementById(id);
      
      if (!svgElement || !(svgElement instanceof SVGElement)) {
        return;
      }

      const svg = svgElement as SVGElement;
      const containerRect = svg.parentElement?.getBoundingClientRect();
      
      if (!containerRect) return;
      
      // Calculate dimensions as percentages of container
      const width = (parseFloat(chart.position.w) / 100) * containerRect.width;
      const height = (parseFloat(chart.position.h) / 100) * containerRect.height;

      // Clear previous content
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      switch (chart.type) {
        case 'bar':
          this.renderBarChart(svg, width, height, chart.data, index);
          break;
        case 'pie':
          this.renderPieChart(svg, width, height, chart.data, index);
          break;
        case 'card':
          this.renderCardChart(svg, width, height, chart.data, chart.title, index);
          break;
      }
    });
  }

  renderBarChart(svg: SVGElement, width: number, height: number, data: number[], chartIndex: number) {
    const padding = { left: 20, right: 10, top: 15, bottom: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const barWidth = chartWidth / data.length - 5;
    const maxValue = Math.max(...data);

    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding.left + index * (barWidth + 5);
      const y = height - padding.bottom - barHeight;
      
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', this.colors[index % this.colors.length]);
      rect.setAttribute('rx', '2');
      svg.appendChild(rect);
    });
  }

  renderPieChart(svg: SVGElement, width: number, height: number, data: number[], chartIndex: number) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    const total = data.reduce((sum, value) => sum + value, 0);
    
    let startAngle = 0;
    data.forEach((value, index) => {
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
      svg.appendChild(path);
      
      startAngle += sliceAngle;
    });
  }

  renderCardChart(svg: SVGElement, width: number, height: number, data: number[], title: string, chartIndex: number) {
    const value = data[0];
    
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', '0');
    bg.setAttribute('y', '0');
    bg.setAttribute('width', width.toString());
    bg.setAttribute('height', height.toString());
    bg.setAttribute('fill', this.colors[chartIndex % this.colors.length]);
    bg.setAttribute('rx', '4');
    svg.appendChild(bg);
    
    const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', (width / 2).toString());
    valueText.setAttribute('y', (height / 2).toString());
    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('dominant-baseline', 'middle');
    valueText.setAttribute('font-size', Math.min(width, height) * 0.2 + 'px');
    valueText.setAttribute('font-weight', 'bold');
    valueText.setAttribute('fill', 'white');
    valueText.textContent = value.toString();
    svg.appendChild(valueText);
  }
}
