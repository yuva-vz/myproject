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
 originalLayout = [
  // { type: 'card', position: { h: '5vh', w: '7vw', x: '44vw', y: '0vh' } },
  // { type: 'bar', position: { h: '14vh', w: '22vw', x: '22vw', y: '0vh' } },
  // { type: 'pie', position: { h: '14vh', w: '22vw', x: '0vw', y: '0vh' } },
  // { type: 'bar', position: { h: '14vh', w: '55vw', x: '0vw', y: '14vh' } },
  // { type: 'card', position: { h: '5vh', w: '7vw', x: '44vw', y: '6vh' } },
 
  { type: 'bar', position: { h: '14vh', w: '22vw', x: '1vw', y: '0vh' } },
  { type: 'table', position: { h: '14vh', w: '22vw', x: '23vw', y: '0vh' } },
  { type: 'card', position: { h: '9vh', w: '15vw', x: '24vw', y: '15vh' } },
  { type: 'pie', position: { h: '14vh', w: '22vw', x: '1vw', y: '15vh' } },
  // { type: 'table', position: { h: '20vh', w: '49vw', x: '1vw', y: '30vh' } },
  { type: 'bar', position: { h: '20vh', w: '49vw', x: '1vw', y: '30vh' } },
  
];

 REF_HEIGHT = 60; // Reference container height
 REF_WIDTH = 60;  // Reference container width
 
 
// ✅ Step 1: Normalize layout to percentages based on 60vh × 60vw
normalizeLayout(layout: any[]) {
  return layout.map(item => {
    const h = parseFloat(item.position.h);
    const w = parseFloat(item.position.w);
    const x = parseFloat(item.position.x);
    const y = parseFloat(item.position.y);

    return {
      type: item.type,
      position: {
        h: `${((h / this.REF_HEIGHT) * 100).toFixed(2)}vw`,
        w: `${((w / this.REF_WIDTH) * 100).toFixed(2)}vw`,
        x: `${((x / this.REF_WIDTH) * 100).toFixed(2)}vw`,
        y: `${((y / this.REF_HEIGHT) * 100).toFixed(2)}vw`,
      }
    };
  });
}

chartInfo = [
  { type: 'card', title: '4772', data: ['123.'] },
  { type: 'pie', title: 'Distribution', data: [30, 25, 20, 15, 10] },
  { type: 'bar', title: 'Facility Stats', data: [15, 8, 7, 7, 6, 5, 4] },
  { type: 'donut', title: 'User Types', data: [40, 30, 20, 10] },
  { type: 'area', title: 'User Growth', data: [10, 20, 30, 40, 50] },
  { type: 'line', title: 'Revenue Growth', data: [100, 120, 110, 140, 160, 180] },
  { 
    type: 'table', 
    title: 'Performance Data', 
    data: [
      ['Product', 'Sales', 'Revenue', 'Growth'],
      ['Product A', '125', '$45K', '+12%'],
      ['Product B', '89', '$32K', '+8%'],
      ['Product C', '156', '$67K', '+15%'],
      ['Product D', '203', '$78K', '+22%']
    ]
  },
  // Add your new chart info objects below as needed
];

normalizedLayout = this.normalizeLayout(this.originalLayout);

// ✅ Step 2: Merge normalized positions with chartInfo
layoutData = this.normalizedLayout.map(layoutItem => {
  const chart = this.chartInfo.find(c => c.type === layoutItem.type);
  return {
    type: layoutItem.type,
    position: layoutItem.position,
    title: chart?.title || '',
    data: chart?.data || []
  };
});
  ngAfterViewInit() {
    // Wait for DOM to be ready
    
    setTimeout(() => {
      this.renderAllCharts();
    }, 100);
  }


  // Chart colors
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',];

 

  renderAllCharts() {
    this.layoutData.forEach((chart, index) => {
      const id = `chart-${chart.type}-${index}`;
      const svgElement = document.getElementById(id);
      
      if (!svgElement || !(svgElement instanceof SVGElement)) {
        console.warn(`SVG element with ID ${id} not found`);
        return;
      }

      const svg = svgElement as SVGElement;
      
      // Convert vh/vw/px units to pixels
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
          this.renderBarChart(svg, width, height, chart.data as number[], index);
          break;
        case 'pie':
          this.renderPieChart(svg, width, height, chart.data as number[], index);
          break;
        case 'donut':
          this.renderDonutChart(svg, width, height, chart.data as number[], index);
          break;
        case 'line':
          this.renderLineChart(svg, width, height, chart.data as number[], index);
          break;
        case 'area':
          this.renderAreaChart(svg, width, height, chart.data as number[], index);
          break;
        case 'card':
          this.renderCardChart(svg, width, height, chart.data as number[], chart.title, index);
          break;
        case 'table':
          this.renderTableChart(svg, width, height, chart.data as string[][], chart.title, index);
          break;
        default:
          console.warn(`Unknown chart type: ${chart.type}`);
      }
    });
  }

  // Convert viewport units (vh, vw) to pixels
  convertToPx(value: string): number {
    if (value.endsWith('vh')) {
      return (parseFloat(value) / 100) * window.innerHeight + 20;
    } else if (value.endsWith('vw')) {
      return (parseFloat(value) / 100) * window.innerWidth +20;
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
      rect.setAttribute('fill', this.colors[0]);
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
      // svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');

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
  renderCardChart(svg: SVGElement, width: number, height: number, data: (number | string)[], title: string, chartIndex: number) {
    // Validate inputs
    if (!data || data.length === 0 || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      console.warn('Invalid data or dimensions for card chart');
      return;
    }

    const value = data[0]; // Cards typically show one value
    
    // // Create background rectangle
    // const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    // bg.setAttribute('x', '0');
    // bg.setAttribute('y', '0');
    // bg.setAttribute('width', width.toString());
    // bg.setAttribute('height', height.toString());
    // bg.setAttribute('fill', 'white');
    // bg.setAttribute('rx', '8');
    // svg.appendChild(bg);
    
    // Add value text
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', (width / 2).toString());
    valueText.setAttribute('y', (height / 2).toString());
    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('dominant-baseline', 'middle');
    valueText.setAttribute('font-size', Math.min(width, height) * 0.3 + 'px');
    valueText.setAttribute('font-weight', 'bold');
    valueText.setAttribute('fill', '#000');
    valueText.setAttribute('border-radius', '18px');
    valueText.textContent = value.toString();
    svg.appendChild(valueText);
    
    // Add title text
    // const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    // titleText.setAttribute('x', (width / 2).toString());
    // titleText.setAttribute('y', (height * 0.8).toString());
    // titleText.setAttribute('text-anchor', 'middle');
    // titleText.setAttribute('font-size', Math.min(width, height) * 0.15 + 'px');
    // titleText.setAttribute('fill', 'white');
    // titleText.textContent = title;
    // svg.appendChild(titleText);
  }

  // 📊 Table Chart Renderer
  renderTableChart(svg: SVGElement, width: number, height: number, data: string[][], title: string, chartIndex: number) {
    // Validate inputs
    if (!data || data.length === 0 || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      console.warn('Invalid data or dimensions for table chart');
      return;
    }

    const padding = { left: 10, right: 10, top: 40, bottom: 10 };
    const tableWidth = width - padding.left - padding.right;
    const tableHeight = height - padding.top - padding.bottom;
    
    if (tableWidth <= 0 || tableHeight <= 0) {
      console.warn('Table dimensions too small after padding');
      return;
    }

    // Calculate dimensions
    const rowCount = data.length;
    const colCount = data[0]?.length || 0;
    const rowHeight = tableHeight / rowCount;
    const colWidth = tableWidth / colCount;

    // Add title
    // const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    // titleText.setAttribute('x', (width / 2).toString());
    // titleText.setAttribute('y', '25');
    // titleText.setAttribute('text-anchor', 'middle');
    // titleText.setAttribute('font-size', '16');
    // titleText.setAttribute('font-weight', 'bold');
    // titleText.setAttribute('fill', '#333');
    // titleText.textContent = title;
    // svg.appendChild(titleText);

    // Create table background
    // const tableBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    // tableBg.setAttribute('x', padding.left.toString());
    // tableBg.setAttribute('y', padding.top.toString());
    // tableBg.setAttribute('width', tableWidth.toString());
    // tableBg.setAttribute('height', tableHeight.toString());
    // tableBg.setAttribute('fill', 'white');
    // tableBg.setAttribute('stroke', '#ddd');
    // tableBg.setAttribute('stroke-width', '1');
    // svg.appendChild(tableBg);

    // Draw table rows and cells
    data.forEach((row, rowIndex) => {
      const y = padding.top + rowIndex * rowHeight;
      
      // // Draw row background (alternating colors)
      // const rowBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      // rowBg.setAttribute('x', padding.left.toString());
      // rowBg.setAttribute('y', y.toString());
      // rowBg.setAttribute('width', tableWidth.toString());
      // rowBg.setAttribute('height', rowHeight.toString());
      // rowBg.setAttribute('fill', rowIndex === 0 ? '#f8f9fa' : (rowIndex % 2 === 0 ? '#ffffff' : '#f8f9fa'));
      // rowBg.setAttribute('stroke', '#ddd');
      // rowBg.setAttribute('stroke-width', '0.5');
      // svg.appendChild(rowBg);

      // Draw cells and text
      row.forEach((cell, colIndex) => {
        const x = padding.left + colIndex * colWidth;
        
        // Draw cell border
        const cellBorder = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        cellBorder.setAttribute('x', x.toString());
        cellBorder.setAttribute('y', y.toString());
        cellBorder.setAttribute('width', colWidth.toString());
        cellBorder.setAttribute('height', rowHeight.toString());
        cellBorder.setAttribute('fill', 'none');
        cellBorder.setAttribute('stroke', '#ddd');
        cellBorder.setAttribute('stroke-width', '0.5');
        cellBorder.setAttribute('border', 'bold');
        svg.appendChild(cellBorder);

        // Add cell text
        // const cellText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        // cellText.setAttribute('x', (x + colWidth / 2).toString());
        // cellText.setAttribute('y', (y + rowHeight / 2 + 4).toString()); // +4 for vertical centering
        // cellText.setAttribute('text-anchor', 'middle');
        // cellText.setAttribute('dominant-baseline', 'middle');
        // cellText.setAttribute('font-size', Math.min(12, rowHeight * 0.6).toString());
        // cellText.setAttribute('font-weight', rowIndex === 0 ? 'bold' : 'normal');
        // cellText.setAttribute('fill', rowIndex === 0 ? '#333' : '#666');
        
        // Truncate text if too long
        // const maxTextLength = Math.floor(colWidth / 8); // Rough estimate
        // const displayText = cell.length > maxTextLength ? cell.substring(0, maxTextLength - 3) + '...' : cell;
        // cellText.textContent = displayText;
        // svg.appendChild(cellText);
      });

      // Draw horizontal line after header
      if (rowIndex === 0) {
        const headerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        headerLine.setAttribute('x1', padding.left.toString());
        headerLine.setAttribute('y1', (y + rowHeight).toString());
        headerLine.setAttribute('x2', (padding.left + tableWidth).toString());
        headerLine.setAttribute('y2', (y + rowHeight).toString());
        headerLine.setAttribute('stroke', '#333');
        headerLine.setAttribute('stroke-width', '2');
        headerLine.setAttribute('border', 'bold');

        svg.appendChild(headerLine);
      }
    });

    // Draw vertical lines for columns
    for (let i = 0; i <= colCount; i++) {
      const x = padding.left + i * colWidth;
      const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      verticalLine.setAttribute('x1', x.toString());
      verticalLine.setAttribute('y1', padding.top.toString());
      verticalLine.setAttribute('x2', x.toString());
      verticalLine.setAttribute('y2', (padding.top + tableHeight).toString());
      verticalLine.setAttribute('stroke', '#ddd');
      verticalLine.setAttribute('border', 'bold');
      verticalLine.setAttribute('stroke-width', i === 0 || i === colCount ? '1' : '0.5');
      svg.appendChild(verticalLine);
      
    }
  }
}
