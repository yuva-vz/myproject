import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-samplesvg',
  templateUrl: './samplesvg.component.html',
  styleUrl: './samplesvg.component.scss'
})
export class SamplesvgComponent implements AfterViewInit {

  // 📊 Dynamic Layout Data - Multiple charts including multiple bars
  // layoutData = [
  //   { type: 'bar', w: '300', h: '200', x: '10px', y: '10px', title: 'Sales Q1', data: [120, 150, 180, 220, 190] },
  //   { type: 'bar', w: '300', h: '200', x: '330px', y: '10px', title: 'Sales Q2', data: [100, 180, 160, 200, 240] },
  //   { type: 'bar', w: '300', h: '200', x: '650px', y: '10px', title: 'Sales Q3', data: [80, 120, 140, 160, 180] },
  //   { type: 'pie', w: '250', h: '250', x: '10px', y: '250px', title: 'Market Share', data: [30, 25, 20, 15, 10] },
  //   { type: 'donut', w: '250', h: '250', x: '280px', y: '250px', title: 'User Types', data: [40, 30, 20, 10] },
  //   { type: 'line', w: '350', h: '200', x: '550px', y: '280px', title: 'Revenue Growth', data: [100, 120, 110, 140, 160, 180] },
  // ];
  layoutPositions = [
    // Top row - Left: Pie chart
    { type: 'pie', position: { h: '40vh', w: '30vw', x: '2vw', y: '2vh' } },
    
    // Top row - Center: Bar chart
    { type: 'bar', position: { h: '40vh', w: '35vw', x: '34vw', y: '2vh' } },
    
    // Top row - Right top: Card 1
    { type: 'card', position: { h: '18vh', w: '25vw', x: '72vw', y: '2vh' } },
    
    // Top row - Right bottom: Card 2  
    { type: 'card', position: { h: '18vh', w: '25vw', x: '72vw', y: '24vh' } },
    
    // Bottom row - Full width: Bar chart
    { type: 'bar', position: { h: '35vh', w: '95vw', x: '2vw', y: '45vh' } },
    // Bottom row - Left: Donut chart
    { type: 'donut', position: { h: '35vh', w: '45vw', x: '2vw', y: '82vh' } },
    {type: 'line', position: { h: '35vh', w: '45vw', x: '52vw', y: '82vh' } },
    // {type: 'area', position: { h: '35vh', w: '45vw', x: '2vw', y: '82vh' } },

  ];

chartInfo = [
  // First bar chart (top center)
  { type: 'bar', title: 'Facility Stats', data: [15, 8, 7, 7, 6, 6, 6, 5, 5, 4] },
  
  // Second bar chart (bottom full width)  
  { type: 'bar', title: 'Facility Overview', data: [15, 8, 7, 7, 6, 6, 6, 5, 5, 4, 3] },
  
  // Pie chart data
  { type: 'pie', title: 'Distribution', data: [30, 25, 20, 15, 10] },
  // Donut chart data
  { type: 'donut', title: 'User Types', data: [40, 30, 20, 10] },
  
  // Cards data
  { type: 'card', title: 'Total Count', data: [4772] },
  { type: 'card', title: 'Facility Types', data: [4772] },
  {type:"line", title: 'Revenue Growth', data: [100, 120, 110, 140, 160, 180] },
  {type: 'area', title: 'Area Chart Example', data: [10, 20, 15, 25, 30, 35] },
];

// tracking how many times each chart type is used
chartCount: Record<string, number> = {};

layoutData = this.layoutPositions.map((layoutItem) => {
  const type = layoutItem.type;

  // init count
  if (!this.chartCount[type]) this.chartCount[type] = 0;

  // find chart with matching type and current count
  const matchingCharts = this.chartInfo.filter(c => c.type === type);
  const chart = matchingCharts[this.chartCount[type]];

  // increase the count for this type
  this.chartCount[type]++;

  return {
    type,
    position: layoutItem.position,
    title: chart?.title || '',
    data: chart?.data || [],
  };
});




  // Chart colors
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

  ngAfterViewInit() {
    // Wait for DOM to be ready
    setTimeout(() => {
      this.renderAllCharts();
    }, 100);
  }

  renderAllCharts() {
    this.layoutData.forEach((chart, index) => {
      const id = `chart-${chart.type}-${index}`;
      const svgElement = document.getElementById(id);
      
      if (!svgElement || !(svgElement instanceof SVGElement)) {
        console.warn(`SVG element with ID ${id} not found`);
        return;
      }

      const svg = svgElement as SVGElement;
      
      // Convert viewport units to pixels
      const width = this.convertToPx(chart.position.w);
      const height = this.convertToPx(chart.position.h);

      // Check if width and height are valid numbers
      if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        console.error(`Invalid dimensions for chart ${id}: width=${width}, height=${height}`);
        return;
      }

      // Clear previous content
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      // Set SVG attributes
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      switch (chart.type) {
        case 'bar':
          this.renderBarChart(svg, width, height, chart.data, index);
          break;
        case 'pie':
          this.renderPieChart(svg, width, height, chart.data, index);
          break;
        case 'donut':
          this.renderDonutChart(svg, width, height, chart.data, index);
          break;
        case 'line':
          this.renderLineChart(svg, width, height, chart.data, index);
          break;
        case 'area':
          this.renderAreaChart(svg, width, height, chart.data, index);
          break;
        case 'card':
          this.renderCardChart(svg, width, height, chart.data, chart.title, index);
          break;
        default:
          console.warn(`Unknown chart type: ${chart.type}`);
      }
    });
  }

  // Convert viewport units (vh, vw) to pixels
  convertToPx(value: string): number {
    if (value.endsWith('vh')) {
      return (parseFloat(value) / 100) * window.innerHeight;
    } else if (value.endsWith('vw')) {
      return (parseFloat(value) / 100) * window.innerWidth;
    } else if (value.endsWith('px')) {
      return parseFloat(value);
    } else {
      // Try to parse as a plain number
      const num = parseFloat(value);
      return isNaN(num) ? 300 : num; // Default to 300 if parsing fails
    }
  }

  // 📊 Bar Chart Renderer
  renderBarChart(svg: SVGElement, width: number, height: number, data: number[], chartIndex: number) {
    // Validate inputs
    if (!data || data.length === 0 || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      console.warn('Invalid data or dimensions for bar chart');
      return;
    }

    const padding = { left: 40, right: 20, top: 30, bottom: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    if (chartWidth <= 0 || chartHeight <= 0) {
      console.warn('Chart dimensions too small after padding');
      return;
    }
    
    const barWidth = chartWidth / data.length - 10;
    const maxValue = Math.max(...data);
    
    if (maxValue <= 0 || isNaN(maxValue)) {
      console.warn('Invalid data values for bar chart');
      return;
    }

    // Create bars
    data.forEach((value, index) => {
      if (isNaN(value) || value < 0) return; // Skip invalid values
      
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding.left + index * (barWidth + 10);
      const y = height - padding.bottom - barHeight;
      
      // Validate calculated values
      if (isNaN(x) || isNaN(y) || isNaN(barWidth) || isNaN(barHeight)) {
        console.warn(`Invalid calculated values for bar ${index}`);
        return;
      }
      
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
      // const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      // text.setAttribute('x', (x + barWidth / 2).toString());
      // text.setAttribute('y', (y - 5).toString());
      // text.setAttribute('text-anchor', 'middle');
      // text.setAttribute('font-size', '12');
      // text.setAttribute('fill', '#333');
      // text.textContent = value.toString();
      // svg.appendChild(text);
    });
  }

  // 🥧 Pie Chart Renderer
  renderPieChart(svg: SVGElement, width: number, height: number, data: number[], chartIndex: number) {
    // Validate inputs
    if (!data || data.length === 0 || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      console.warn('Invalid data or dimensions for pie chart');
      return;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const total = data.reduce((sum, value) => sum + value, 0);
    
    if (total <= 0 || isNaN(total)) {
      console.warn('Invalid data total for pie chart');
      return;
    }
    
    let startAngle = 0;
    data.forEach((value, index) => {
      if (isNaN(value) || value <= 0) return; // Skip invalid values
      
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

  // 🍩 Donut Chart Renderer
  renderDonutChart(svg: SVGElement, width: number, height: number, data: number[], chartIndex: number) {
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2 - 20;
    const innerRadius = outerRadius * 0.6;
    const total = data.reduce((sum, value) => sum + value, 0);
    
    let startAngle = 0;
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      // Outer arc points
      const x1 = centerX + outerRadius * Math.cos(startAngle);
      const y1 = centerY + outerRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(startAngle + sliceAngle);
      const y2 = centerY + outerRadius * Math.sin(startAngle + sliceAngle);
      
      // Inner arc points
      const x3 = centerX + innerRadius * Math.cos(startAngle + sliceAngle);
      const y3 = centerY + innerRadius * Math.sin(startAngle + sliceAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);
      
      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      
      const pathData = [
        `M ${x1},${y1}`,
        `A ${outerRadius},${outerRadius} 0 ${largeArc} 1 ${x2},${y2}`,
        `L ${x3},${y3}`,
        `A ${innerRadius},${innerRadius} 0 ${largeArc} 0 ${x4},${y4}`,
        'Z'
      ].join(' ');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', this.colors[index % this.colors.length]);
      svg.appendChild(path);
      
      startAngle += sliceAngle;
    });
  }

  // 📈 Line Chart Renderer
  renderLineChart(svg: SVGElement, width: number, height: number, data: number[], chartIndex: number) {
    const padding = { left: 40, right: 20, top: 30, bottom: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...data);
    const stepX = chartWidth / (data.length - 1);
    
    // Create line path
    const pathData = data.map((value, index) => {
      const x = padding.left + index * stepX;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
    
    // Draw line
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', this.colors[chartIndex % this.colors.length]);
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    
    // Draw points
    data.forEach((value, index) => {
      const x = padding.left + index * stepX;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', this.colors[chartIndex % this.colors.length]);
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);
    });
  }
  

  // 📊 Area Chart Renderer
  renderAreaChart(svg: SVGElement, width: number, height: number, data: number[], chartIndex: number) {
    // Validate inputs
    if (!data || data.length === 0 || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      console.warn('Invalid data or dimensions for area chart');
      return;
    }

    const padding = { left: 40, right: 20, top: 30, bottom: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    if (chartWidth <= 0 || chartHeight <= 0) {
      console.warn('Chart dimensions too small after padding');
      return;
    }
    
    const maxValue = Math.max(...data);
    
    if (maxValue <= 0 || isNaN(maxValue)) {
      console.warn('Invalid data values for area chart');
      return;
    }
    
    const stepX = chartWidth / (data.length - 1);
    
    // Create area path (filled area under the line)
    let areaPathData = `M ${padding.left},${padding.top + chartHeight}`;
    
    // Add points for the top line
    data.forEach((value, index) => {
      if (isNaN(value) || value < 0) return; // Skip invalid values
      
      const x = padding.left + index * stepX;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      // Validate calculated values
      if (isNaN(x) || isNaN(y)) {
        console.warn(`Invalid calculated values for area point ${index}`);
        return;
      }
      
      areaPathData += ` L ${x},${y}`;
    });
    
    // Close the area by going back to the bottom
    areaPathData += ` L ${padding.left + (data.length - 1) * stepX},${padding.top + chartHeight} Z`;
    
    // Draw filled area
    const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    areaPath.setAttribute('d', areaPathData);
    areaPath.setAttribute('fill', this.colors[chartIndex % this.colors.length]);
    areaPath.setAttribute('fill-opacity', '0.3');
    areaPath.setAttribute('stroke', 'none');
    svg.appendChild(areaPath);
    
    // Create line path (outline)
    const linePathData = data.map((value, index) => {
      if (isNaN(value) || value < 0) return ''; // Skip invalid values
      
      const x = padding.left + index * stepX;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      if (isNaN(x) || isNaN(y)) return '';
      
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    }).filter(segment => segment !== '').join(' ');
    
    // Draw line
    const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    linePath.setAttribute('d', linePathData);
    linePath.setAttribute('fill', 'none');
    linePath.setAttribute('stroke', this.colors[chartIndex % this.colors.length]);
    linePath.setAttribute('stroke-width', '3');
    linePath.setAttribute('stroke-linecap', 'round');
    svg.appendChild(linePath);
    
    // Draw points
    data.forEach((value, index) => {
      if (isNaN(value) || value < 0) return; // Skip invalid values
      
      const x = padding.left + index * stepX;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      if (isNaN(x) || isNaN(y)) return;
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', this.colors[chartIndex % this.colors.length]);
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);
    });
  }
  

  // 📊 Card Chart Renderer
  renderCardChart(svg: SVGElement, width: number, height: number, data: number[], title: string, chartIndex: number) {
    // Validate inputs
    if (!data || data.length === 0 || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      console.warn('Invalid data or dimensions for card chart');
      return;
    }

    const value = data[0]; // Cards typically show one value
    
    // Create background rectangle
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', '0');
    bg.setAttribute('y', '0');
    bg.setAttribute('width', width.toString());
    bg.setAttribute('height', height.toString());
    bg.setAttribute('fill', this.colors[chartIndex % this.colors.length]);
    bg.setAttribute('rx', '8');
    svg.appendChild(bg);
    
    // Add value text
    const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', (width / 2).toString());
    valueText.setAttribute('y', (height / 2).toString());
    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('dominant-baseline', 'middle');
    valueText.setAttribute('font-size', Math.min(width, height) * 0.3 + 'px');
    valueText.setAttribute('font-weight', 'bold');
    valueText.setAttribute('fill', 'white');
    valueText.textContent = value.toString();
    svg.appendChild(valueText);
    
    // Add title text
    const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleText.setAttribute('x', (width / 2).toString());
    titleText.setAttribute('y', (height * 0.8).toString());
    titleText.setAttribute('text-anchor', 'middle');
    titleText.setAttribute('font-size', Math.min(width, height) * 0.15 + 'px');
    titleText.setAttribute('fill', 'white');
    titleText.textContent = title;
    svg.appendChild(titleText);
  }
}
