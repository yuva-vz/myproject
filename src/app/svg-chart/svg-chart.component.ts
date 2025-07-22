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
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  @ViewChild('svgChart', { static: true }) svgRef!: ElementRef<SVGElement>;
  @ViewChild('svgPie', { static: true }) svgPieRef!: ElementRef<SVGElement>;
  @ViewChild('svgDonut', { static: true }) svgDonutRef!: ElementRef<SVGElement>;
  @ViewChild('svgArea', { static: true }) svgAreaRef!: ElementRef<SVGElement>;
  @ViewChild('svgCardChart', { static: true }) svgCardChartRef!: ElementRef<SVGElement>;
  @ViewChild('svgLine', { static: true }) svgLineRef!: ElementRef<SVGElement>;
  @ViewChild('svgCards', { static: true }) svgCardsRef!: ElementRef<SVGElement>;

  // // 📱 RESPONSIVE HELPER METHODS
  // getResponsiveDimensions(svg: SVGElement): { width: number; height: number } {
  //   const container = svg.parentElement;
  //   if (container) {
  //     const containerRect = container.getBoundingClientRect();
  //     const padding = 32; // Account for container padding
  //     return {
  //       width: Math.max(containerRect.width - padding, 250), // Minimum 250px
  //       height: Math.max(containerRect.height - padding, 200) // Minimum 200px
  //     };
  //   }
  //   // Fallback dimensions
  //   return { width: 300, height: 250 };
  // }

  // setResponsiveSVG(svg: SVGElement, width: number, height: number) {
  //   svg.setAttribute('width', '100%');
  //   svg.setAttribute('height', '100%');
  //   svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  //   svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  //   svg.style.maxWidth = '100%';
  //   svg.style.maxHeight = '100%';
  // }

  // Convert viewport units (vh, vw) to pixels as number
  // convertToPx(value: string): number {
  //   if (value.endsWith('vh')) {
  //     return (parseFloat(value) / 100) * window.innerHeight;
  //   } else if (value.endsWith('vw')) {
  //     return (parseFloat(value) / 100) * window.innerWidth;
  //   } else {
  //     return parseFloat(value);
  //   }
  // }

  chartData = [
    { x: 10, y: 30, width: 40, height: 120, },
    { x: 60, y: 30, width: 40, height: 100,  },
    { x: 110, y: 30, width: 40, height: 80, },
    { x: 160, y: 30, width: 40, height: 140,  },
    { x: 210, y: 30, width: 40, height: 110,  },
    { x: 260, y: 30, width: 40, height: 90,  },
    // { x: 310, y: 30, width: 40, height: 70, type: 'bar', label: 'Jul' },
    // { x: 360, y: 30, width: 40, height: 130, type: 'bar', label: 'Aug' },
    // { x: 410, y: 30, width: 40, height: 120, type: 'bar', label: 'Sep' },
    // { x: 460, y: 30, width: 40, height: 100, type: 'bar', label: 'Oct' }
  ]
  
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
  layoutData: { type: string; svg: ElementRef<SVGElement>; w: string; h: string; x: string; y: string; }[] | undefined;

ngAfterViewInit(): void {
  const svgRefMap: Record<string, ElementRef<SVGElement>> = {
    bar: this.svgRef,
    pie: this.svgPieRef,
    donut: this.svgDonutRef,
    area: this.svgAreaRef,
    card: this.svgCardChartRef,
    line: this.svgLineRef,
    cards: this.svgCardsRef
  };

  // Helper to convert viewport units to pixels
  const convertToPx = (value: string): string => {
    if (value.endsWith('vh')) {
      return ((parseFloat(value) / 100) * window.innerHeight).toString();
    } else if (value.endsWith('vw')) {
      return ((parseFloat(value) / 100) * window.innerWidth).toString();
    } else {
      return value;
    }
  };

  const apiResponse = [
    {
      type: 'pie',
      position: { height: '14vh', width: '22vw', x: '22vw', y: '0vh' }
    },
    {
      type: 'bar',
      position: { height: '14vh',width: '22vw', x: '0vw', y: '0vh' }
    },
    {
      type: 'bar',
      position: { height: '14vh',width: '22vw', x: '5vw', y: '10vh' }
    },
    {
      type: 'donut',
      position: { height: '14vh', width: '22vw', x: '-4vw', y: '50vh' }
    },
    {
      type: 'area',
      position: { height: '14vh', width: '30vw', x: '2vw', y: '30vh' }
    }
  ];

  // Convert all positions to px for assignment
  apiResponse.forEach(item => {
    item.position.width = convertToPx(item.position.width);
    item.position.height = convertToPx(item.position.height);
    item.position.x = convertToPx(item.position.x);
    item.position.y = convertToPx(item.position.y);
  });

  this.layoutData = apiResponse
    .filter(item => svgRefMap[item.type])
    .map(item => ({
      type: item.type,
      svg: svgRefMap[item.type],
      w: item.position.width,
      h: item.position.height,
      x: item.position.x,
      y: item.position.y
    }));

  this.layoutData.forEach(({ type, svg, w, h, x, y }: { type: string; svg: ElementRef<SVGElement>; w: string; h: string; x: string; y: string; }) => {
    const svgEl = svg?.nativeElement;
    if (!svgEl) return;
    svgEl.setAttribute('width', w);
    svgEl.setAttribute('height', h);
    svgEl.setAttribute('style', `position: absolute; margin-left: ${x}; margin-top: ${y};`);
    switch (type) {
      case 'bar':
        this.renderChart(svgEl);
        break;
     
      case 'pie':
        this.renderPieChart(svgEl,);
        break;
        
      case 'donut':
        this.renderDonutChart(svgEl, );
        break;
      case 'area':
        this.renderAreaChart(svgEl);
        break;
      case 'line':
        this.renderLineChart(svgEl);
        break;
      // case 'card':
      //   this.renderSvgCards(svgEl);
      //   break;
      case 'cards':
        this.renderSvgCards(svgEl);
        break;
    }
  });
}
// // 1. Map for type to SVG reference


  // ngAfterViewInit(): void {
    
    
  //   this.renderChart();
  //   this.renderPieChart();
  //   this.renderDonutChart();
  //   this.renderAreaChart();
  //   this.renderLineChart();
  //   this.renderSVGCards();
  // }



  // @HostListener('window:resize')
  // onResize() {
  //   this.clearChart();
  //   this.renderChart(this.svgRef.nativeElement);
  //   this.clearPieChart();
  //   this.renderPieChart(this.svgPieRef.nativeElement);
  //   this.clearDonutChart();
  //   this.renderDonutChart(this.svgDonutRef.nativeElement);
  //   this.clearAreaChart();
  //   this.renderAreaChart(this.svgAreaRef.nativeElement);
  //   this.clearLineChart();
  //   this.renderLineChart(this.svgLineRef.nativeElement);
  // }

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

  renderChart(nativeElement: SVGElement, ) {
    const svg = nativeElement;
    const height = 150;
    const width = 300;
    
    svg.setAttribute('width', width.toString());


    svg.setAttribute('height', height.toString());
    // Remove any gradient defs if present
    const defs = svg.querySelector('defs');
    if (defs) svg.removeChild(defs);

    // Axis (optional)
    // this.createLine(svg, 2.5, 0, 2, height); // y-axis
    // this.createLine(svg, 0, height, width, height); // x-axis

    // Loop through data
    this.chartData.forEach((data) => {
   
      this.createRect(svg, data.x, height - data.y - data.height, data.width, data.height, '#42a5f5');

      // this.createText(svg, data.label, data.x + data.width / 2, heightNum - 5, true);
    });
  }

  clearPieChart() {
    const svg = this.svgPieRef.nativeElement;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  renderPieChart(nativeElement: SVGElement,  ) {
    const svg = this.svgPieRef.nativeElement;
    
   
    const widtht = svg.clientWidth || svg.parentElement?.clientWidth || 300 ; 
    const heightt = svg.clientHeight || svg.parentElement?.clientHeight || 300;
    svg.setAttribute('width', widtht.toString());
    svg.setAttribute('height', heightt.toString());
    const radius = Math.min(widtht, heightt) / 2 - 10;
    const cx = widtht / 2;
    const cy = heightt / 2;
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
      // this.createText(svg, data.label, lx, ly);
      startAngle += sliceAngle;
    });
  }

  clearDonutChart() {
    const svg = this.svgDonutRef.nativeElement;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  renderDonutChart(nativeElement: SVGElement, ) {
    const svg = this.svgDonutRef.nativeElement;
    // Convert string parameters to numbers
    const widthNum = Number(nativeElement.getAttribute('width')) || 300;
    const heightNum = Number(nativeElement.getAttribute('height')) || 300;
    svg.setAttribute('width', widthNum.toString());
    svg.setAttribute('height', heightNum.toString());
    const outerRadius = Math.min(widthNum, heightNum) / 2 - 10;
    const innerRadius = outerRadius * 0.6;
    const cx = widthNum / 2;
    const cy = heightNum / 2;
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
      // this.createText(svg, data.label, lx, ly);
      startAngle += sliceAngle;
    });
  }

  clearAreaChart() {
    const svg = this.svgAreaRef.nativeElement;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  renderAreaChart(nativeElement: SVGElement) {
    const svg = this.svgAreaRef.nativeElement;
    const width = svg.clientWidth || svg.parentElement?.clientWidth || 300;
    const height = svg.clientHeight || svg.parentElement?.clientHeight || 150;
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Convert width and height to numbers for calculation
   
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

  // createText(svg: SVGElement, textValue: string, x: number, y: number, rotate: boolean = false) {
  //   const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  //   text.setAttribute('x', x.toString());
  //   text.setAttribute('y', y.toString());
  //   text.textContent = textValue;
  //   text.setAttribute('font-size', '11');
  //   text.setAttribute('text-anchor', 'middle');
  //   text.setAttribute('alignment-baseline', 'middle');
  //   // if (rotate) {
  //   //   text.setAttribute('transform', `rotate(-45,${x},${y})`);
  //   // } else {
  //   //   // Move text 1% higher (relative to font size, approx 1px up)
  //   //   const yNum = parseFloat(y.toString());
  //   //   text.setAttribute('y', (yNum - 1).toString());
  //   // }
  //   // if (rotate) {
  //   //   text.setAttribute('transform', `rotate(-45,${x},${y})`);
  //   // }
  //   svg.appendChild(text);
  // }

  // createLine(svg: SVGElement, x1: number, y1: number, x2: number, y2: number) {
  //   const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  //   line.setAttribute('x1', x1.toString());
  //   line.setAttribute('y1', y1.toString());
  //   line.setAttribute('x2', x2.toString());
  //   line.setAttribute('y2', y2.toString());
  //   line.setAttribute('stroke', 'black');
  //   // No margin or alignment needed here; centering is handled by SVG coordinates.
  //   svg.appendChild(line);
  // }

  getPieColor(i: number): string {
    const colors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#fe9da7'];
    return colors[i % colors.length];
  }

  clearLineChart() {
    const svg = this.svgLineRef.nativeElement;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  renderLineChart(nativeElement: SVGElement) {
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

    // // Draw axes
    // this.createLine(svg, paddingX, paddingY, paddingX, height - paddingY); // y-axis
    // this.createLine(svg, paddingX, height - paddingY, width - paddingX, height - paddingY); // x-axis

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
      // this.createText(svg, d.label, x, height - 5);
    });
  }
  renderSvgCards(svgEl: SVGElement) {
  const width = 200;
  const height = 100;

  // Clear previous content
  svgEl.innerHTML = '';

  // Set SVG dimensions
  svgEl.setAttribute('width', width.toString());
  svgEl.setAttribute('height', height.toString());

  // Get the only card data
  const card = this.svgCardsData[0];

  // Background Rectangle
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', '10');
  rect.setAttribute('y', '10');
  rect.setAttribute('width', '180');
  rect.setAttribute('height', '80');
  rect.setAttribute('rx', '10');
  rect.setAttribute('fill', '#1976d2');
  svgEl.appendChild(rect);

  // Number Text
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', '100');
  text.setAttribute('y', '60');
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('font-size', '30');
  text.setAttribute('fill', 'white');
  text.textContent = card.number;
  svgEl.appendChild(text);
}



}
