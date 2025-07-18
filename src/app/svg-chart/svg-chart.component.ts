import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-svg-chart',
  templateUrl: './svg-chart.component.html',
  styleUrls: ['./svg-chart.component.scss'],
})
export class SvgChartComponent implements AfterViewInit {
  @ViewChild('svgChart', { static: false }) svgRef!: ElementRef<SVGElement>;
  @ViewChild('svgPie', { static: false }) svgPieRef!: ElementRef<SVGElement>;
  @ViewChild('svgDonut', { static: false }) svgDonutRef!: ElementRef<SVGElement>;
  @ViewChild('svgArea', { static: false }) svgAreaRef!: ElementRef<SVGElement>;
  @ViewChild('svgCardChart', { static: false }) svgCardChartRef!: ElementRef<SVGElement>;
  @ViewChild('svgLine', { static: false }) svgLineRef!: ElementRef<SVGElement>;
  @ViewChild('svgCards', { static: false }) svgCardsRef!: ElementRef<SVGElement>;
   //
  // Chart data for bar chart
  // Chart data for bar chart
  // Chart data for pie chart
  chartData = [
    { label: 'Jan', type: 'bar', x: 10, y: 30, width: 40, height: 80 },
    { label: 'Feb', type: 'bar', x: 60, y: 30, width: 40, height: 120 },
    { label: 'Mar', type: 'bar', x: 110, y: 30, width: 40, height: 60 },
    { label: 'Apr', type: 'bar', x: 160, y: 30, width: 40, height: 140 },
    { label: 'May', type: 'bar', x: 210, y: 30, width: 40, height: 100 },
    { label: 'Jun', type: 'bar', x: 260, y: 30, width: 40, height: 90 },
    { label: 'Jul', type: 'bar', x: 310, y: 30, width: 40, height: 130 },
    { label: 'Aug', type: 'bar', x: 360, y: 30, width: 40, height: 70 },
    { label: 'Sep', type: 'bar', x: 410, y: 30, width: 40, height: 110 },
    { label: 'Oct', type: 'bar', x: 460, y: 30, width: 40, height: 80 }
  ];
  // Chart data for area chart
  // Chart data for area line chart

  chartDataArea = [
    { label: 'Jan', value: 80 },
    { label: 'Feb', value: 120 },
    { label: 'Mar', value: 60 },
    { label: 'Apr', value: 140 },
    { label: 'May', value: 100 },
    { label: 'Jun', value: 90 },
    { label: 'Jul', value: 130 },
    { label: 'Aug', value: 70 },
    { label: 'Sep', value: 110 },
    { label: 'Oct', value: 80 }
  ];

  // SVG Cards Data
  svgCardsData = [
    { number: '30', label: 'Job data', highlighted: true },
  //   { number: '4', label: 'Time & attendance\nmanagement', highlighted: false },
  //   { number: '5', label: 'Absence', highlighted: false },
  //   { number: '3', label: 'Separation', highlighted: false },
  //   { number: '12', label: 'Payroll management', highlighted: false },
  //   { number: '8', label: 'Performance\nManagement', highlighted: false },
  //   { number: '2', label: 'Talent acquisition', highlighted: false }
   ];

  ngAfterViewInit(): void {
    
    this.renderChart();
    this.renderPieChart();
    this.renderDonutChart();
    this.renderAreaChart();
    this.renderLineChart();
    this.renderSVGCards();
  }

  @HostListener('window:resize')
  onResize() {
    this.clearChart();
    this.renderChart();
    this.clearPieChart();
    this.renderPieChart();
    this.clearDonutChart();
    this.renderDonutChart();
    this.clearAreaChart();
    this.renderAreaChart();
    this.clearLineChart();
    this.renderLineChart();
  }

  clearChart() {
    const svg = this.svgRef.nativeElement;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  createRect(svg: SVGElement, x: number, y: number, width: number, height: number, color: string) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x.toString());
    rect.setAttribute('y', y.toString());
    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', height.toString());
    rect.setAttribute('fill', color); // simple solid color
    svg.appendChild(rect);
  }

  renderChart() {
    const svg = this.svgRef.nativeElement;
    const width = svg.clientWidth || svg.parentElement?.clientWidth || 600;
    const height = svg.clientHeight || 300;
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Remove any gradient defs if present
    const defs = svg.querySelector('defs');
    if (defs) svg.removeChild(defs);

    // Axis (optional)
    this.createLine(svg, 2.5, 0, 2, height); // y-axis
    this.createLine(svg, 0, height, width, height); // x-axis

    // Loop through data
    this.chartData.forEach((data) => {
      if (data.type === 'bar') {
        this.createRect(svg, data.x, height - data.y - data.height, data.width, data.height, '#42a5f5');
        this.createText(svg, data.label, data.x + data.width / 2, height - 5, true);
      }
    });
  }

  clearPieChart() {
    const svg = this.svgPieRef.nativeElement;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  renderPieChart() {
    const svg = this.svgPieRef.nativeElement;
    const width = svg.clientWidth || svg.parentElement?.clientWidth || 300;
    const height = svg.clientHeight || 300;
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    const radius = Math.min(width, height) / 2 - 10;
    const cx = width / 2;
    const cy = height / 2;
    // if you want  to  add new json move the  chartData   and  new json .
    const total = this.chartData.reduce((sum, d) => sum + d.height, 0);
    let startAngle = 0;
    this.chartData.forEach((data, i) => {
      const value = data.height;
      const sliceAngle = (value / total) * 2 * Math.PI;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(startAngle + sliceAngle);
      const y2 = cy + radius * Math.sin(startAngle + sliceAngle);
      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const pathData = [
        `M ${cx},${cy}`,
        `L ${x1},${y1}`,
        `A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}`,
        'Z'
      ].join(' ');
      this.createPiePath(svg, pathData, this.getPieColor(i));
      // Label
      const midAngle = startAngle + sliceAngle / 2;
      const lx = cx + (radius / 1.5) * Math.cos(midAngle);
      const ly = cy + (radius / 1.5) * Math.sin(midAngle);
      this.createText(svg, data.label, lx, ly);
      startAngle += sliceAngle;
    });
  }

  clearDonutChart() {
    const svg = this.svgDonutRef.nativeElement;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  renderDonutChart() {
    const svg = this.svgDonutRef.nativeElement;
    const width = svg.clientWidth || svg.parentElement?.clientWidth || 300;
    const height = svg.clientHeight || 300;
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    const outerRadius = Math.min(width, height) / 2 - 10;
    const innerRadius = outerRadius * 0.6;
    const cx = width / 2;
    const cy = height / 2;
    const total = this.chartData.reduce((sum, d) => sum + d.height, 0);
    let startAngle = 0;
    this.chartData.forEach((data, i) => {
      const value = data.height;
      const sliceAngle = (value / total) * 2 * Math.PI;
      // Outer arc
      const x1 = cx + outerRadius * Math.cos(startAngle);
      const y1 = cy + outerRadius * Math.sin(startAngle);
      const x2 = cx + outerRadius * Math.cos(startAngle + sliceAngle);
      const y2 = cy + outerRadius * Math.sin(startAngle + sliceAngle);
      // Inner arc
      const x3 = cx + innerRadius * Math.cos(startAngle + sliceAngle);
      const y3 = cy + innerRadius * Math.sin(startAngle + sliceAngle);
      const x4 = cx + innerRadius * Math.cos(startAngle);
      const y4 = cy + innerRadius * Math.sin(startAngle);
      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const pathData = [
        `M ${x1},${y1}`,
        `A ${outerRadius},${outerRadius} 0 ${largeArc} 1 ${x2},${y2}`,
        `L ${x3},${y3}`,
        `A ${innerRadius},${innerRadius} 0 ${largeArc} 0 ${x4},${y4}`,
        'Z'
      ].join(' ');
      this.createDonutPath(svg, pathData, this.getPieColor(i));
      // Label
      const midAngle = startAngle + sliceAngle / 2;
      const lx = cx + (outerRadius + innerRadius) / 2 * Math.cos(midAngle);
      const ly = cy + (outerRadius + innerRadius) / 2 * Math.sin(midAngle);
      this.createText(svg, data.label, lx, ly);
      startAngle += sliceAngle;
    });
  }

  clearAreaChart() {
    const svg = this.svgAreaRef.nativeElement;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  renderAreaChart() {
    const svg = this.svgAreaRef.nativeElement;
    const width = svg.clientWidth || svg.parentElement?.clientWidth || 600;
    const height = svg.clientHeight || 300;
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Clear previous
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const paddingX = 30;
    const maxVal = Math.max(...this.chartDataArea.map(d => d.value));
    const minVal = 0;
    const stepX = (width - 2 * paddingX) / (this.chartDataArea.length - 1);
    // const yTicks = 5;
    // const yStep = (maxVal - minVal) / (yTicks - 1);

    // Build area path FIRST so labels/grid are on top
    let path = `M ${paddingX},${height} `;
    this.chartDataArea.forEach((d, i) => {
      const x = paddingX + stepX * i;
      const y = height - (d.value / maxVal) * height;
      path += `L ${x},${y} `;
    });
    path += `L ${paddingX + stepX * (this.chartDataArea.length - 1)},${height} Z`;

    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', path);
    area.setAttribute('fill', '#90caf9');
    area.setAttribute('stroke', '#42a5f5');
    area.setAttribute('stroke-width', '2');
    svg.appendChild(area);

    // // Draw grid lines and Y axis labels (on top of area)
    // for (let i = 0; i < yTicks; i++) {
    //   const yVal = minVal + i * yStep;
    //   const y = height - (yVal / maxVal) * height;
    //   // Grid line
    //   const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    //   grid.setAttribute('x1', paddingX.toString());
    //   grid.setAttribute('y1', y.toString());
    //   grid.setAttribute('x2', (width - paddingX).toString());
    //   grid.setAttribute('y2', y.toString());
    //   grid.setAttribute('stroke', '#e0e0e0');
    //   grid.setAttribute('stroke-width', '1');
    //   svg.appendChild(grid);
    //   // Y label
    //   const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    //   label.setAttribute('x', (paddingX - 5).toString());
    //   label.setAttribute('y', (y - 2).toString());
    //   label.setAttribute('font-size', '12');
    //   label.setAttribute('fill', '#222');
    //   label.setAttribute('font-weight', 'bold');
    //   label.setAttribute('text-anchor', 'end');
    //   label.textContent = Math.round(yVal).toString();
    //   svg.appendChild(label);
    // }

    // Draw X axis labels (on top of area)
    // this.chartDataArea.forEach((d, i) => {
    //   const x = paddingX + stepX * i;
    //   const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    //   label.setAttribute('x', x.toString());
    //   label.setAttribute('y', (height + -1).toString()); // Move 2px further down
    //   label.setAttribute('font-size', '12');
    //   label.setAttribute('fill', '#222');
    //   label.setAttribute('text-anchor', 'middle');
    //   label.setAttribute('font-weight', 'bold');
    //   label.textContent = d.label;
    //   svg.appendChild(label);
    // });
  }

  createPiePath(svg: SVGElement, d: string, color: string) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', color); // simple solid color
    svg.appendChild(path);
  }

  createDonutPath(svg: SVGElement, d: string, color: string) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', color);
    svg.appendChild(path);
  }

  createText(svg: SVGElement, textValue: string, x: number, y: number, rotate: boolean = false) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x.toString());
    text.setAttribute('y', y.toString());
    text.textContent = textValue;
    text.setAttribute('font-size', '11');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
    // if (rotate) {
    //   text.setAttribute('transform', `rotate(-45,${x},${y})`);
    // } else {
    //   // Move text 1% higher (relative to font size, approx 1px up)
    //   const yNum = parseFloat(y.toString());
    //   text.setAttribute('y', (yNum - 1).toString());
    // }
    // if (rotate) {
    //   text.setAttribute('transform', `rotate(-45,${x},${y})`);
    // }
    svg.appendChild(text);
  }

  createLine(svg: SVGElement, x1: number, y1: number, x2: number, y2: number) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    line.setAttribute('stroke', 'black');
    // No margin or alignment needed here; centering is handled by SVG coordinates.
    svg.appendChild(line);
  }

  getPieColor(i: number): string {
    const colors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7'];
    return colors[i % colors.length];
  }

  clearLineChart() {
    const svg = this.svgLineRef.nativeElement;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  renderLineChart() {
    const svg = this.svgLineRef.nativeElement;
    const width = svg.clientWidth || svg.parentElement?.clientWidth || 600;
    const height = 300;
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Clear previous
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const paddingX = 40;
    const paddingY = 20;
    const maxVal = Math.max(...this.chartDataArea.map(d => d.value));
    const stepX = (width - 2 * paddingX) / (this.chartDataArea.length - 1);

    // Draw axes
    this.createLine(svg, paddingX, paddingY, paddingX, height - paddingY); // y-axis
    this.createLine(svg, paddingX, height - paddingY, width - paddingX, height - paddingY); // x-axis

    //Create line path
    const path = this.chartDataArea.map((d, i) => {
      const x = paddingX + i * stepX;
      const y = height - paddingY - (d.value / maxVal) * (height - 2 * paddingY);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    //Draw line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', path);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', '#1e88e5');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);

    // Draw points
    this.chartDataArea.forEach((d, i) => {
      const x = paddingX + i * stepX;
      const y = height - paddingY - (d.value / maxVal) * (height - 2 * paddingY);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#1e88e5');
      svg.appendChild(circle);
    });

    // Draw X-axis labels
    this.chartDataArea.forEach((d, i) => {
      const x = paddingX + i * stepX;
      this.createText(svg, d.label, x, height - 5);
    });
  }

  renderSVGCards() {
    const svg = this.svgCardsRef.nativeElement;
    const cardWidth = 130;
    const cardHeight = 120;
    const gap = 15;
    const startX = 50;
    const startY = 50;

    // Clear previous content
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    this.svgCardsData.forEach((card, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const x = startX + col * (cardWidth + gap);
      const y = startY + row * (cardHeight + gap);

      // Create card group for animations
      const cardGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      cardGroup.setAttribute('class', 'card-group');
      cardGroup.setAttribute('style', 'cursor: pointer; transition: all 0.3s ease;');

      // Create card background
      const cardRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      cardRect.setAttribute('x', x.toString());
      cardRect.setAttribute('y', y.toString());
      cardRect.setAttribute('width', cardWidth.toString());
      cardRect.setAttribute('height', cardHeight.toString());
      cardRect.setAttribute('rx', '12');
      cardRect.setAttribute('ry', '12');
      cardRect.setAttribute('fill', '#ffffff');
      
      // if (card.highlighted) {
      //   cardRect.setAttribute('stroke', '#8bc34a');
      //   cardRect.setAttribute('stroke-width', '3');
      //   cardRect.setAttribute('fill', '#f8fff8');
      // } else {
      //   cardRect.setAttribute('stroke', '#e0e0e0');
      //   cardRect.setAttribute('stroke-width', '2');
      // }
      
      // cardRect.setAttribute('style', 'filter: drop-shadow(0 2px 6px rgba(0,0,0,0.1)); transition: all 0.3s ease;');
      // cardGroup.appendChild(cardRect);

      // Create number text
      const numberText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      numberText.setAttribute('x', (x + cardWidth / 2).toString());
      numberText.setAttribute('y', (y + cardHeight / 2 - 10).toString());
      numberText.setAttribute('text-anchor', 'middle');
      numberText.setAttribute('font-size', '36');
      numberText.setAttribute('font-weight', 'bold');
      numberText.setAttribute('fill', '#2c5aa0');
      numberText.setAttribute('style', 'transition: all 0.3s ease;');
      numberText.textContent = card.number;
      cardGroup.appendChild(numberText);

      // Create label text (handle multi-line)
      const labelLines = card.label.split('\n');
      labelLines.forEach((line, lineIndex) => {
        const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelText.setAttribute('x', (x + cardWidth / 2).toString());
        labelText.setAttribute('y', (y + cardHeight / 2 + 25 + lineIndex * 16).toString());
        labelText.setAttribute('text-anchor', 'middle');
        labelText.setAttribute('font-size', '12');
        labelText.setAttribute('font-weight', '500');
        labelText.setAttribute('fill', '#757575');
        labelText.setAttribute('style', 'transition: all 0.3s ease;');
        labelText.textContent = line;
        cardGroup.appendChild(labelText);
      });

      // Add hover effects
    //   cardGroup.addEventListener('mouseenter', () => {
    //     cardRect.setAttribute('style', 'filter: drop-shadow(0 8px 20px rgba(0,0,0,0.2)); transition: all 0.3s ease;');
    //     cardGroup.setAttribute('transform', `translate(0, -5)`);
    //     numberText.setAttribute('fill', '#1976d2');
    //     if (!card.highlighted) {
    //       cardRect.setAttribute('stroke', '#42a5f5');
    //       cardRect.setAttribute('stroke-width', '3');
    //     }
    //   });

    //   cardGroup.addEventListener('mouseleave', () => {
    //     cardRect.setAttribute('style', 'filter: drop-shadow(0 2px 6px rgba(0,0,0,0.1)); transition: all 0.3s ease;');
    //     cardGroup.setAttribute('transform', `translate(0, 0)`);
    //     numberText.setAttribute('fill', '#2c5aa0');
    //     if (!card.highlighted) {
    //       cardRect.setAttribute('stroke', '#e0e0e0');
    //       cardRect.setAttribute('stroke-width', '2');
    //     }
    //   });

    //   // Add click effect
    //   cardGroup.addEventListener('click', () => {
    //     // Pulse animation
    //     cardGroup.setAttribute('transform', `translate(0, -2) scale(1.05)`);
    //     setTimeout(() => {
    //       cardGroup.setAttribute('transform', `translate(0, -5) scale(1)`);
    //     }, 150);
        
    //     // Show card info (you can customize this)
    //     alert(`Card clicked: ${card.label} - ${card.number}`);
    //   });

    //   // Add ripple effect on mousedown
    //   cardGroup.addEventListener('mousedown', () => {
    //     cardGroup.setAttribute('transform', `translate(0, -3) scale(0.98)`);
    //   });

    //   cardGroup.addEventListener('mouseup', () => {
    //     cardGroup.setAttribute('transform', `translate(0, -5) scale(1)`);
    //   });

    //   svg.appendChild(cardGroup);
    // });
      svg.appendChild(cardGroup);
    }
    );
  } // End of renderSVGCards

}
