import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-canvas-dashboard',
  templateUrl: './canvas-dashboard.component.html',
  styleUrls: ['./canvas-dashboard.component.scss']
})
export class CanvasDashboardComponent implements AfterViewInit {
  @ViewChild('dynamicCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() dashboardId!: number;
  ctx!: CanvasRenderingContext2D;
  
  // Canvas viewport dimensions
  // canvasVW = 20; // 20vw
  // canvasVH = 20; // 20vh
colors = [
  "#005DA6", // Royal Blue
  "#FFC52F", // Saffron Yellow
  "#BAE1FF", // Light Sky Blue
  "#75C2FF", // Light Blue
  "#30A4FF", // Dodger Blue
  "#00467D", // Navy Blue
  "#CBC53E", // Olive Green
  "#089AD7", // Cyan Blue
  "#6D6E71", // Gray
  "#D0CECE", // Light Gray
  "#DE354C", // Crimson Red
  "#932432", // Dark Red / Maroon
  "#3C1874", // Dark Purple
  "#283747", // Charcoal Gray
  "#DDAF94"
];

  // Layout data using the same structure as samplesvg component
  originalLayout = [
     { type: 'card', position: { h: '5vh', w: '7vw', x: '44vw', y: '0vh' } },
  { type: 'funnel', position: { h: '14vh', w: '22vw', x: '22vw', y: '0vh' } },
  { type: 'bubble', position: { h: '14vh', w: '22vw', x: '0vw', y: '0vh' } },
  { type: '', position: { h: '14vh', w: '40vw', x: '0vw', y: '14vh' } },
  { type: 'card', position: { h: '5vh', w: '7vw', x: '44vw', y: '6vh' } },
  { type: 'waterfall', position: { h: '16vh', w: '18vw', x: '40vw', y: '14vh' } },
  
  ];

  // Filter items where h > '60vh' or w > '60vw'
  // getLargeItems() {
  //   return this.originalLayout.filter(item => {
  //     const h = parseFloat(item.position.h);
  //     const w = parseFloat(item.position.w);
  //     return h > 60 || w > 60;
  //   });
  // }

  REF_HEIGHT = 60; // Reference container height
  REF_WIDTH = 60;  // Reference container width

chartInfo = [
    { type: 'card', title: 'Distribution', data: ['123.'] },
    { type: 'pie', title: 'Distribution', data: [30, 30, 30, 30, 30, 30,30] },
    { type: 'bar', title: 'Facility Stats', data: [15, 18, 27, 26, 16, 15, 34, 23, 22, 12] },
    { type: 'donut', title: 'User Types', data: [30, 30, 30, 30, 30] },
    { type: 'line', title: 'Revenue Growth', data: [100, 120, 110, 140, 160, 180, 200, 220, 210, 230] },
    { 
      type: 'table', 
      title: 'A,b', 
      data: [
    ['A', 'B', 'C'], // ✅ Added "State" column in header
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-']
  ],

    },
    // Treemap chart data - Indian states with population-based proportions
    { 
      type: 'treemap', 
      title: 'State Population Distribution',
      data: [
        { label: 'KARNATAKA', value: 30713, color: '#5B9BD5' },
        { label: 'TAMIL NADU', value: 15956, color: '#70AD47' },
        // { label: 'ANDHRA PRADESH', value: 17805, color: '#FFC000' },
        { label: 'TELANGANA', value: 11226, color: '#4472C4' },
        { label: 'KERALA', value: 8547, color: '#C65911' }
      ],
      
  },
      
    // New chart types data
    { type: 'area', title: 'Area Chart', data: [20, 45, 35, 60, 50, 75, 65, 85] },
    { 
      type: 'waterfall', 
      title: 'Row ID Count', 
      data: [
        { label: 'A', value: 8000, type: 'start' },
        { label: 'B', value: 4800, type: 'positive' },
        { label: 'C', value: 5000, type: 'positive' },
        { label: 'D', value: 4500, type: 'positive' },
        // { label: 'E', value: 700, type: 'positive' },
        // { label: 'F', value: 1, type: 'positive' },
        // { label: 'G', value: 1, type: 'positive' },
        // { label: '6509-08', value: 1, type: 'positive' },
        // { label: '6509-09', value: 1, type: 'positive' },
        // { label: 'Total', value: 9, type: 'end' }
      ]
    },
      
    { 
      type: 'bubble', 
      title: 'Bubble Chart', 
      data: [
        { x: 20, y: 30, size: 2, label: 'A' },
        { x: 40, y: 70, size: 4, label: 'B' },
        { x: 65, y: 45, size: 2, label: 'C' },
        { x: 80, y: 80, size: 2, label: 'D' }
      ]
    },
    { 
      type: 'radar', 
      title: 'Performance', 
      data: [
        { axis: 'Speed', value: 80 },
        { axis: 'Quality', value: 90 },
        { axis: 'Cost', value: 60 },
        { axis: 'Reliability', value: 85 },
        { axis: 'Innovation', value: 70 }
      ]
    },
    { 
      type: 'funnel', 
      title: 'Sales Funnel', 
      data: [
        { label: 'Leads', value: 1000 },
        { label: 'Prospects', value: 800 },
        { label: 'Qualified', value: 600 },
        { label: 'Proposals', value: 300 },
        { label: 'Closed', value: 150 }
      ]
    }
];

  layoutData: any[] = [];

  
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    
    // Set canvas to fixed size for consistent rendering
    // canvas.width = 1900;
    // canvas.height = 1200;

    canvas.width = 378; // 378px
    canvas.height = 210; // 210px


    // // Set canvas display size to match internal resolution
    // canvas.style.width = '100vw';
    // canvas.style.height = '100vh';
    // canvas.style.width = '378px';
    // canvas.style.height = '210px';


    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Normalize layout and merge with chart info
    this.normalizeLayout();
    this.mergeLayoutWithChartInfo();
    
    setTimeout(() => {
      this.renderAllCharts();
    }, 100);
  }

  // Normalize layout to percentages based on reference dimensions
  normalizeLayout() {
    this.layoutData = this.originalLayout.map(item => {
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

  // Merge normalized positions with chartInfo
  mergeLayoutWithChartInfo() {
    this.layoutData = this.layoutData.map(layoutItem => {
      const chart = this.chartInfo.find(c => c.type === layoutItem.type);
      return {
        type: layoutItem.type,
        position: layoutItem.position,
        title: chart?.title || '',
        data: chart?.data || []
      };
    });
     console.log('Layout Data:', this.layoutData);
  }
 

  renderAllCharts() {
    const canvas = this.canvasRef.nativeElement;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Set canvas background with gradient
    // const gradient = this.ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    // gradient.addColorStop(0, '#0f3460');
    // gradient.addColorStop(0.5, '#0e2139');
    // gradient.addColorStop(1, '#1a1a2e');
    // this.ctx.fillStyle = gradient;
    // this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    this.layoutData.forEach((chart, index) => {
      const width = this.convertToPx(chart.position.w, 'width');
      const height = this.convertToPx(chart.position.h, 'height');
      const x = this.convertToPx(chart.position.x, 'width');
      const y = this.convertToPx(chart.position.y, 'height');

      // Draw chart background
    //   this.drawChartBackground(x, y, width, height);
      
      // Draw chart based on type
      switch (chart.type) {
        case 'bar':
          this.drawBarChart(chart.data as number[], x, y, width, height, chart.title);
          break;
        case 'pie':
          this.drawPieChart(chart.data as number[], x, y, width, height, chart.title);
          break;
        case 'donut':
          this.drawDonutChart(chart.data as number[], x, y, width, height, chart.title);
          break;
        case 'line':
          this.drawLineChart(chart.data as number[], x, y, width, height, chart.title);
          break;
        case 'card':
          this.drawCard(chart.data[0], x, y, width, height, chart.title);
          break;
        case 'table':
          this.drawTable(chart.data as string[][], x, y, width, height, chart.title);
          break;
        case 'treemap':
          this.drawTreemapChart(chart.data as any[], x, y, width, height, chart.title);
          break;
        case 'area':
          this.drawAreaChart(chart.data as number[], x, y, width, height, chart.title);
          break;
        case 'waterfall':
          this.drawWaterfallChart(chart.data as any[], x, y, width, height, chart.title);
          break;
        case 'bubble':
          this.drawBubbleChart(chart.data as any[], x, y, width, height, chart.title);
          break;
        case 'radar':
          this.drawRadarChart(chart.data as any[], x, y, width, height, chart.title);
          break;
        case 'funnel':
          this.drawFunnelChart(chart.data as any[], x, y, width, height, chart.title);
          break;
        default:
          console.warn(`Unknown chart type: ${chart.type}`);
      }
    });
  }

//   drawChartBackground(x: number, y: number, width: number, height: number) {
//     // Draw white background with border
//     this.ctx.fillStyle = 'white';
//     this.ctx.fillRect(x, y, width, height);
    
//     // Draw border
//     this.ctx.strokeStyle = '#e1e5e9';
//     this.ctx.lineWidth = 1;
//     this.ctx.strokeRect(x, y, width, height);
//   }

  drawBarChart(data: number[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 10;
    const titleHeight = 20;
    const chartArea = height - titleHeight - padding * 2;
    const chartWidth = width - padding * 2;
    const barWidth = chartWidth / data.length - 5;
    const maxValue = Math.max(...data);

    // // Draw title
    // this.ctx.fillStyle = '#333';
    // this.ctx.font = '12px Arial';
    // this.ctx.textAlign = 'center';
    // this.ctx.fillText(title, x + width / 2, y + 15);

    // Draw bars
    data.forEach((val, i) => {
      const barHeight = (val / maxValue) * chartArea;
      const barX = x + padding + i * (barWidth + 5);
      const barY = y + titleHeight + padding + (chartArea - barHeight);
      
      this.ctx.fillStyle = this.colors[0];
      // Draw bar with reduced border radius
      const radius = 2; // Small border radius
      this.ctx.beginPath();
      this.ctx.moveTo(barX + radius, barY);
      this.ctx.lineTo(barX + barWidth - radius, barY);
      this.ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + radius);
      this.ctx.lineTo(barX + barWidth, barY + barHeight - radius);
      this.ctx.quadraticCurveTo(barX + barWidth, barY + barHeight, barX + barWidth - radius, barY + barHeight);
      this.ctx.lineTo(barX + radius, barY + barHeight);
      this.ctx.quadraticCurveTo(barX, barY + barHeight, barX, barY + barHeight - radius);
      this.ctx.lineTo(barX, barY + radius);
      this.ctx.quadraticCurveTo(barX, barY, barX + radius, barY);
      this.ctx.closePath();
      this.ctx.fill();
    });
  }

  drawPieChart(data: number[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 10;
    const titleHeight = 20;
    const radius = Math.min(width, height - titleHeight) / 2 - padding;
    const centerX = x + width / 2;
    const centerY = y + titleHeight + (height - titleHeight) / 2;
    const total = data.reduce((a, b) => a + b, 0);

    // // Draw title
    // this.ctx.fillStyle = '#333';
    // this.ctx.font = '12px Arial';
    // this.ctx.textAlign = 'center';
    // this.ctx.fillText(title, x + width / 2, y + 15);

    let startAngle = -Math.PI / 2;
    data.forEach((val, i) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = this.colors[i % this.colors.length];
      this.ctx.fill();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      startAngle += sliceAngle;
    });
  }

  drawDonutChart(data: number[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 10;
    const titleHeight = 20;
    const outerRadius = Math.min(width, height - titleHeight) / 2 - padding;
    const innerRadius = outerRadius * 0.6;
    const centerX = x + width / 2;
    const centerY = y + titleHeight + (height - titleHeight) / 2;
    const total = data.reduce((a, b) => a + b, 0);

    // // Draw title
    // this.ctx.fillStyle = '#333';
    // this.ctx.font = '12px Arial';
    // this.ctx.textAlign = 'center';
    // this.ctx.fillText(title, x + width / 2, y + 15);

    let startAngle = -Math.PI / 2;
    data.forEach((val, i) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      this.ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      this.ctx.closePath();
      this.ctx.fillStyle = this.colors[i % this.colors.length];
      this.ctx.fill();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      startAngle += sliceAngle;
    });
  }

  drawLineChart(data: number[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 10;
    const titleHeight = 20;
    const chartArea = height - titleHeight - padding * 2;
    const chartWidth = width - padding * 2;
    const maxValue = Math.max(...data);
    const stepX = chartWidth / (data.length - 1);

    // // Draw title
    // this.ctx.fillStyle = '#333';
    // this.ctx.font = '12px Arial';
    // this.ctx.textAlign = 'center';
    // this.ctx.fillText(title, x + width / 2, y + 15);

    // Draw line
    this.ctx.beginPath();
    data.forEach((val, idx) => {
      const pointX = x + padding + idx * stepX;
      const pointY = y + titleHeight + padding + (chartArea - (val / maxValue) * chartArea);
      
      if (idx === 0) {
        this.ctx.moveTo(pointX, pointY);
      } else {
        this.ctx.lineTo(pointX, pointY);
      }
    });
    this.ctx.strokeStyle = this.colors[0];
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // Draw points
    data.forEach((val, idx) => {
      const pointX = x + padding + idx * stepX;
      const pointY = y + titleHeight + padding + (chartArea - (val / maxValue) * chartArea);
      
      this.ctx.beginPath();
      this.ctx.arc(pointX, pointY, 3, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.colors[0];
      this.ctx.fillStyle = this.colors[0];
      this.ctx.fill();
    });
  }

  drawCard(value: (number|string)[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 10;
    
    // Draw card background with gradient
    // Draw card background with white fill and black border
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, width, height);

    // Draw value
    this.ctx.fillStyle = 'black'
    this.ctx.font = 'bold 25px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(value.toString(), x + width / 2, y + height / 2 + 8);

    // Draw title
    // this.ctx.font = 'bold 5px Arial';
    
    // this.ctx.fillText(title, x + width / 2, y + height - 10);
  }

drawTable(data: string[][], x: number, y: number, width: number, height: number, title: string) {
  const padding = 8;
  const titleHeight = 20;
  const rowHeight = (height - titleHeight - padding) / data.length;
  const colWidth = (width - padding * 2) / data[0].length;

//   // Draw Title
//   this.ctx.fillStyle = '#333';
//   this.ctx.font = 'bold 14px Arial';
//   this.ctx.textAlign = 'center';
//   this.ctx.fillText(title, x + width / 2, y + 15);

  data.forEach((row, rowIdx) => {
    const rowY = y + titleHeight + rowIdx * rowHeight;

    // Header Row Background
    if (rowIdx === 0) {
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.fillRect(x + padding, rowY, width - padding * 2, rowHeight);
    }

    row.forEach((cell, colIdx) => {
      const cellX = x + padding + colIdx * colWidth;

      // Cell border
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(cellX, rowY, colWidth, rowHeight);

      // Cell text
      if (rowIdx === 0) {
        this.ctx.fillStyle = '#005DA6'; // Header text color
        this.ctx.font = 'bold 12px Arial';
      } else {
        this.ctx.fillStyle = '#333';
        this.ctx.font = '11px Arial';
      }
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // Wrap text if too long
      const text = cell.length > 20 ? cell.substring(0, 17) + '...' : cell;
      this.ctx.fillText(text, cellX + colWidth / 2, rowY + rowHeight / 2);
    });
  });
}



  convertToPx(value: string, dimension: 'width' | 'height'): number {
    const canvas = this.canvasRef.nativeElement;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    if (value.endsWith('%')) {
      const percentage = parseFloat(value) / 100;
      return dimension === 'width' ? percentage * canvasWidth : percentage * canvasHeight;
    }
    if (value.endsWith('vh')) {
      return (parseFloat(value) / 100) * canvasHeight;
    }
    if (value.endsWith('vw')) {
      return (parseFloat(value) / 100) * canvasWidth;
    }
    if (value.endsWith('px')) {
      return parseFloat(value);
    }
    return parseFloat(value) || 100;
  }

  // // Viewport-based canvas resizing function
  // resizeCanvasToVWVH(canvas: HTMLCanvasElement, vw: number, vh: number) {
  //   const widthPx = (window.innerWidth * vw) / 100;
  //   const heightPx = (window.innerHeight * vh) / 100;

  //   // Internal resolution
  //   canvas.width = widthPx;
  //   canvas.height = heightPx;

  //   // Display size
  //   canvas.style.width = `${widthPx}px`;
  //   canvas.style.height = `${heightPx}px`;
  // }

  // // Handle window resize events
  // @HostListener('window:resize', ['$event'])
  // onWindowResize() {
  //   if (this.canvasRef?.nativeElement) {
  //     this.resizeCanvasToVWVH(this.canvasRef.nativeElement, this.canvasVW, this.canvasVH);
  //     // Re-render charts after resize
  //     setTimeout(() => {
  //       this.renderAllCharts();
  //     }, 100);
  //   }
  // }

  // Area Chart - Stacked area or filled line chart
  drawAreaChart(data: number[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 10;
    const titleHeight = 20;
    const chartArea = height - titleHeight - padding * 2;
    const chartWidth = width - padding * 2;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    // Draw background
    // this.ctx.fillStyle = 'white';
    // this.ctx.fillRect(x, y, width, height);
    // this.ctx.strokeStyle = '#e1e5e9';
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeRect(x, y, width, height);

    // // Draw title
    // this.ctx.fillStyle = '#333';
    // this.ctx.font = '12px Arial';
    // this.ctx.textAlign = 'left';
    // this.ctx.fillText(title, x + padding, y + titleHeight - 5);

    // Create area path
    this.ctx.beginPath();
    const baseY = y + titleHeight + padding + chartArea;
    
    // Start from bottom left
    this.ctx.moveTo(x + padding, baseY);
    
    // Draw the area line
    data.forEach((value, i) => {
      const pointX = x + padding + (i / (data.length - 1)) * chartWidth;
      const pointY = y + titleHeight + padding + chartArea - ((value - minValue) / range) * chartArea;
      this.ctx.lineTo(pointX, pointY);
    });
    
    // Close area to bottom right
    this.ctx.lineTo(x + padding + chartWidth, baseY);
    this.ctx.closePath();
    
    // Fill area with gradient
    const gradient = this.ctx.createLinearGradient(0, y + titleHeight + padding, 0, baseY);
    gradient.addColorStop(0, this.colors[0] + '80'); // Semi-transparent
    gradient.addColorStop(1, this.colors[0] + '20'); // More transparent
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Draw line on top
    this.ctx.beginPath();
    data.forEach((value, i) => {
      const pointX = x + padding + (i / (data.length - 1)) * chartWidth;
      const pointY = y + titleHeight + padding + chartArea - ((value - minValue) / range) * chartArea;
      
      if (i === 0) {
        this.ctx.moveTo(pointX, pointY);
      } else {
        this.ctx.lineTo(pointX, pointY);
      }
    });
    this.ctx.strokeStyle = this.colors[0];
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  

  // Bubble Chart - Scatter plot with size dimension
  drawBubbleChart(data: any[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 15;
    const titleHeight = 20;
    const chartArea = height - titleHeight - padding * 2;
    const chartWidth = width - padding * 2;
    
    // Draw background
    // this.ctx.fillStyle = 'white';
    // this.ctx.fillRect(x, y, width, height);
    // this.ctx.strokeStyle = '#e1e5e9';
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeRect(x, y, width, height);

    // // Draw title
    // this.ctx.fillStyle = '#333';
    // this.ctx.font = '12px Arial';
    // this.ctx.textAlign = 'left';
    // this.ctx.fillText(title, x + padding, y + titleHeight - 5);

    // Find ranges for scaling
    const maxX = Math.max(...data.map(d => d.x + 5));
    const maxY = Math.max(...data.map(d => d.y + 5));
    const maxSize = Math.max(...data.map(d => d.size));

    // Draw bubbles
    data.forEach((bubble, i) => {
      const bubbleX = x + padding + (bubble.x / maxX) * chartWidth;
      const bubbleY = y + titleHeight + padding + chartArea - (bubble.y / maxY) * chartArea;
      const radius = (bubble.size / maxSize) * 15; // Max radius 15px

      // Draw bubble
      this.ctx.beginPath();
      this.ctx.arc(bubbleX, bubbleY, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.colors[i % this.colors.length] + '80'; // Semi-transparent
      this.ctx.fill();
      this.ctx.strokeStyle = this.colors[i % this.colors.length];
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      // Draw label
      // this.ctx.fillStyle = '#333';
      // this.ctx.font = '5px Arial';
      // this.ctx.textAlign = 'center';
      // this.ctx.fillText(bubble.label, bubbleX, bubbleY + radius + 12);
    });

    // Draw simple axes
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    // X-axis
    this.ctx.beginPath();
    this.ctx.moveTo(x + padding, y + titleHeight + padding + chartArea);
    this.ctx.lineTo(x + padding + chartWidth, y + titleHeight + padding + chartArea);
    this.ctx.stroke();
    // Y-axis
    this.ctx.beginPath();
    this.ctx.moveTo(x + padding, y + titleHeight + padding);
    this.ctx.lineTo(x + padding, y + titleHeight + padding + chartArea);
    this.ctx.stroke();
  }

  // Radar Chart - Spider web chart with multiple axes
  drawRadarChart(data: any[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 20;
    const titleHeight = 20;
    const chartSize = Math.min(width - padding * 2, height - titleHeight - padding * 2);
    const centerX = x + width / 2;
    const centerY = y + titleHeight + padding + chartSize / 2;
    const radius = chartSize / 2 - 10;

    // Draw background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeStyle = '#e1e5e9';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, width, height);

    // Draw title
    this.ctx.fillStyle = '#333';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, x + width / 2, y + titleHeight - 5);

    const angleStep = (2 * Math.PI) / data.length;
    const maxValue = Math.max(...data.map(d => d.value));

    // Draw grid circles
    this.ctx.strokeStyle = '#f0f0f0';
    this.ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
      this.ctx.stroke();
    }

    // Draw axes and labels
    this.ctx.strokeStyle = '#ddd';
    this.ctx.lineWidth = 1;
    data.forEach((item, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      const endX = centerX + Math.cos(angle) * radius;
      const endY = centerY + Math.sin(angle) * radius;

      // Draw axis line
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();

      // Draw axis label
      const labelX = centerX + Math.cos(angle) * (radius + 15);
      const labelY = centerY + Math.sin(angle) * (radius + 15);
      this.ctx.fillStyle = '#666';
      this.ctx.font = '9px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(item.axis, labelX, labelY);
    });

    // Draw data polygon
    this.ctx.beginPath();
    data.forEach((item, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = item.value;
      const distance = (value / maxValue) * radius;
      const pointX = centerX + Math.cos(angle) * distance;
      const pointY = centerY + Math.sin(angle) * distance;

      if (i === 0) {
        this.ctx.moveTo(pointX, pointY);
      } else {
        this.ctx.lineTo(pointX, pointY);
      }
    });
    this.ctx.closePath();

    // Fill the area
    this.ctx.fillStyle = this.colors[0] + '40'; // Semi-transparent
    this.ctx.fill();
    
    // Stroke the outline
    this.ctx.strokeStyle = this.colors[0];
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw data points
    data.forEach((item, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = item.value;
      const distance = (value / maxValue) * radius;
      const pointX = centerX + Math.cos(angle) * distance;
      const pointY = centerY + Math.sin(angle) * distance;

      this.ctx.beginPath();
      this.ctx.arc(pointX, pointY, 3, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.colors[0];
      this.ctx.fill();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
  }

  // Funnel Chart - Shows data flowing through stages with decreasing values
  drawFunnelChart(data: any[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 10;
    const titleHeight = 20;
    const chartArea = height - titleHeight - padding * 2;
    const chartWidth = width - padding * 2;

    // // Draw title
    // this.ctx.fillStyle = '#333';
    // this.ctx.font = '12px Arial';
    // this.ctx.textAlign = 'center';
    // this.ctx.fillText(title, x + width / 2, y + titleHeight - 5);

    // Calculate total value for proportional sizing
    const totalValue = Math.max(...data.map(item => item.value));
    
    // Draw funnel segments
    const segmentHeight = chartArea / data.length;
    
    data.forEach((item, index) => {
      const ratio = item.value / totalValue;
      const segmentWidth = chartWidth * ratio;
      const segmentX = x + padding + (chartWidth - segmentWidth) / 2;
      const segmentY = y + titleHeight + padding + index * segmentHeight;
      
      // Draw funnel segment with trapezoid shape
      this.ctx.fillStyle = this.colors[index % this.colors.length];
      
      // Create trapezoid path
      this.ctx.beginPath();
      
      if (index === 0) {
        // Top segment - rectangle
        this.ctx.rect(segmentX, segmentY, segmentWidth, segmentHeight);
      } else {
        // Calculate width of previous segment for trapezoid shape
        const prevRatio = data[index - 1].value / totalValue;
        const prevSegmentWidth = chartWidth * prevRatio;
        const prevSegmentX = x + padding + (chartWidth - prevSegmentWidth) / 2;
        
        // Draw trapezoid
        this.ctx.moveTo(prevSegmentX, segmentY);
        this.ctx.lineTo(prevSegmentX + prevSegmentWidth, segmentY);
        this.ctx.lineTo(segmentX + segmentWidth, segmentY + segmentHeight);
        this.ctx.lineTo(segmentX, segmentY + segmentHeight);
        this.ctx.closePath();
      }
      
      this.ctx.fill();
      
      // Add border
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // // Add label
      // this.ctx.fillStyle = 'white';
      // this.ctx.font = '10px Arial';
      // this.ctx.textAlign = 'center';
      // const labelX = x + width / 2;
      // const labelY = segmentY + segmentHeight / 2 + 3;
      // this.ctx.fillText(`${item.label}: ${item.value}`, labelX, labelY);
    });
  }

  // Treemap Chart - Hierarchical data visualization with rectangles
  drawTreemapChart(data: any[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 10;
    const titleHeight = 20;
    const chartArea = height - titleHeight - padding * 2;
    const chartWidth = width - padding * 2;

    // Draw background
    // this.ctx.fillStyle = 'white';
    // this.ctx.fillRect(x, y, width, height);
    // this.ctx.strokeStyle = '#e1e5e9';
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeRect(x, y, width, height);

    // // Draw title
    // this.ctx.fillStyle = '#333';
    // this.ctx.font = '12px Arial';
    // this.ctx.textAlign = 'left';
    // this.ctx.fillText(title, x + padding, y + titleHeight - 5);

    // Calculate total value for proportional sizing
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    
    // Simple squarified treemap algorithm
    const rectangles = this.calculateTreemapRectangles(data, x + padding, y + titleHeight + padding, chartWidth, chartArea, totalValue);

    // Draw rectangles
    rectangles.forEach((rect, i) => {
      // Draw rectangle
      this.ctx.fillStyle = rect.color || this.colors[i % this.colors.length];
      this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      
      // Draw border
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Draw label if rectangle is large enough
      // if (rect.width > 50 && rect.height > 30) {
      //   this.ctx.fillStyle = 'white';
      //   this.ctx.font = 'bold 12px Arial';
      //   this.ctx.textAlign = 'center';
      //   this.ctx.textBaseline = 'middle';
        
      //   // State name
      //   const centerX = rect.x + rect.width / 2;
      //   const centerY = rect.y + rect.height / 2;
        
      //   this.ctx.fillText(rect.label, centerX, centerY - 8);
        
      //   // Value in parentheses
      //   this.ctx.font = '10px Arial';
      //   this.ctx.fillText(`(${rect.value})`, centerX, centerY + 8);
      // }
    });
  }

  // Helper method to calculate treemap rectangles with better proportional layout
  private calculateTreemapRectangles(
    data: any[],
    startX: number,
    startY: number,
    totalWidth: number,
    totalHeight: number,
    totalValue: number
  ) {
    const rectangles: any[] = [];
    
    // Sort data by value (largest first) for better visual balance
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    
    // Calculate aspect ratio for optimal rectangle shapes
    const aspectRatio = totalWidth / totalHeight;
    
    // Use a simple but effective layout algorithm
    let remainingData = [...sortedData];
    let currentX = startX;
    let currentY = startY;
    let remainingWidth = totalWidth;
    let remainingHeight = totalHeight;
    
    while (remainingData.length > 0) {
      if (remainingData.length === 1) {
        // Last item gets all remaining space
        const item = remainingData[0];
        rectangles.push({
          x: currentX,
          y: currentY,
          width: remainingWidth,
          height: remainingHeight,
          label: item.label,
          value: item.value,
          color: item.color
        });
        break;
      }
      
      // For 2 items, split optimally
      if (remainingData.length === 2) {
        const [item1, item2] = remainingData;
        const total = item1.value + item2.value;
        
        if (remainingWidth > remainingHeight) {
          // Split vertically
          const width1 = remainingWidth * (item1.value / total);
          rectangles.push({
            x: currentX,
            y: currentY,
            width: width1,
            height: remainingHeight,
            label: item1.label,
            value: item1.value,
            color: item1.color
          });
          rectangles.push({
            x: currentX + width1,
            y: currentY,
            width: remainingWidth - width1,
            height: remainingHeight,
            label: item2.label,
            value: item2.value,
            color: item2.color
          });
        } else {
          // Split horizontally
          const height1 = remainingHeight * (item1.value / total);
          rectangles.push({
            x: currentX,
            y: currentY,
            width: remainingWidth,
            height: height1,
            label: item1.label,
            value: item1.value,
            color: item1.color
          });
          rectangles.push({
            x: currentX,
            y: currentY + height1,
            width: remainingWidth,
            height: remainingHeight - height1,
            label: item2.label,
            value: item2.value,
            color: item2.color
          });
        }
        break;
      }
      
      // For more items, take the largest and split the space
      const largestItem = remainingData[0];
      const remainingItems = remainingData.slice(1);
      const remainingTotal = remainingItems.reduce((sum, item) => sum + item.value, 0);
      const largestRatio = largestItem.value / (largestItem.value + remainingTotal);
      
      if (remainingWidth > remainingHeight) {
        // Split vertically - largest item takes left portion
        const largestWidth = remainingWidth * largestRatio;
        rectangles.push({
          x: currentX,
          y: currentY,
          width: largestWidth,
          height: remainingHeight,
          label: largestItem.label,
          value: largestItem.value,
          color: largestItem.color
        });
        
        // Update for remaining items
        currentX += largestWidth;
        remainingWidth -= largestWidth;
        remainingData = remainingItems;
      } else {
        // Split horizontally - largest item takes top portion
        const largestHeight = remainingHeight * largestRatio;
        rectangles.push({
          x: currentX,
          y: currentY,
          width: remainingWidth,
          height: largestHeight,
          label: largestItem.label,
          value: largestItem.value,
          color: largestItem.color
        });
        
        // Update for remaining items
        currentY += largestHeight;
        remainingHeight -= largestHeight;
        remainingData = remainingItems;
      }
    }
    
    return rectangles;
  }
  
//     drawTreemapChart(data: any[], x: number, y: number, width: number, height: number) {
//   const totalValue = data.reduce((sum, item) => sum + item.value, 0);

//   let currentX = x + 2;
//   let currentY = y + 2;
//   let remainingWidth = width;
//   let remainingHeight = height;

//   // Sort by value (largest first)
//   const sortedData = [...data].sort((a, b) => b.value - a.value);

//   // For simplicity, split into 2 rows dynamically
//   let rows = 2;
//   let rowHeight = remainingHeight / rows;

//   sortedData.forEach((item, index) => {
//     const area = (item.value / totalValue) * (width * height);
//     const rectWidth = area / rowHeight;

//     // If no space in current row → new row
//     if (currentX + rectWidth > x + width) {
//       currentX = x;
//       currentY += rowHeight;
//     }

//     // Draw rectangle
//     this.ctx.fillStyle = item.color;
//     this.ctx.fillRect(currentX, currentY, rectWidth, rowHeight);
//     this.ctx.strokeStyle = 'black';
//     this.ctx.strokeRect(currentX, currentY, rectWidth, rowHeight);

//     // Draw text inside
//     // this.ctx.fillStyle = '#000';
//     // this.ctx.font = '10px Arial';
//     // this.ctx.textAlign = 'center';
//     // this.ctx.textBaseline = 'middle';
//     // this.ctx.fillText(item.label, currentX + rectWidth / 2, currentY + rowHeight / 2);

//     currentX += rectWidth;
//   });
// }


  // Helper method to finalize a row in the treemap
  private finalizeTreemapRow(items: any[], startX: number, startY: number, rowWidth: number, rowHeight: number, rectangles: any[]) {
    let currentX = startX;
    
    items.forEach(item => {
      rectangles.push({
        x: currentX,
        y: startY,
        width: item.width,
        height: rowHeight,
        label: item.label,
        value: item.value,
        color: item.color
      });
      currentX += item.width;
    });
  }

  // Waterfall Chart - Clear and responsive cumulative visualization
  drawWaterfallChart(data: any[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 3;
    const titleHeight = 10;
    const chartArea = height - titleHeight - padding * 2 - 30; // Extra space for labels
    const chartWidth = width - padding * 2;
    
    // Calculate bar dimensions
    const barCount = data.length;
    const totalSpacing = chartWidth * 0.2; // 20% for spacing
    const barWidth = (chartWidth - totalSpacing) / barCount;
    const spacing = totalSpacing / (barCount - 1);
    
    // Calculate cumulative values
    let cumulativeValue = 0;
    const processedData = data.map((item, i) => {
      let startValue = cumulativeValue;
      let endValue = startValue;
      
      if (item.type === 'start') {
        endValue = item.value;
        cumulativeValue = item.value;
      } else if (item.type === 'end') {
        endValue = item.value; // Total value
      } else {
        endValue = startValue + item.value;
        cumulativeValue += item.value;
      }
      
      return {
        ...item,
        startValue,
        endValue,
        displayValue: item.value
      };
    });
    
    // Find scaling range
    const allValues = processedData.flatMap(item => [item.startValue, item.endValue]);
    const minValue = 0; // Always start from 0 for clarity
    const maxValue = Math.max(...allValues) * 1.1; // Add 10% padding
    const range = maxValue - minValue;
    
    // // Draw chart background with border
    // this.ctx.fillStyle = '#ffffff';
    // this.ctx.fillRect(x, y, width, height);
    // this.ctx.strokeStyle = '#e0e0e0';
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeRect(x, y, width, height);
    
    // Draw title
    // this.ctx.fillStyle = '#333';
    // this.ctx.font = 'bold 14px Arial';
    // this.ctx.textAlign = 'left';
    // this.ctx.fillText(title, x + padding, y + titleHeight - 5);
    
    const baseY = y + titleHeight + padding + chartArea;
    const zeroY = baseY; // Zero line at bottom
    
    // Draw horizontal grid lines
    const gridLines = 5;
    this.ctx.strokeStyle = '#f5f5f5';
    this.ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= gridLines; i++) {
      const gridValue = (maxValue * i) / gridLines;
      const gridY = baseY - (gridValue / maxValue) * chartArea;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x + padding, gridY);
      this.ctx.lineTo(x + width - padding, gridY);
      this.ctx.stroke();
      
    //   // Grid value labels
    //   this.ctx.fillStyle = '#666';
    //   this.ctx.font = '10px Arial';
    //   this.ctx.textAlign = 'right';
    //   this.ctx.fillText(Math.round(gridValue).toString(), x + padding - 5, gridY + 3);
    }
    
    // Draw bars
    processedData.forEach((item, i) => {
      const barX = x + padding + i * (barWidth + spacing);
      
      let barY, barHeight;
      let fillColor, strokeColor;
      
      if (item.type === 'start') {
        // Starting bar from zero
        barHeight = (item.value / maxValue) * chartArea;
        barY = baseY - barHeight;
        fillColor = '#4CAF50'; // Green
        strokeColor = '#388E3C';
      } else if (item.type === 'end') {
        // Total bar from zero
        barHeight = (item.value / maxValue) * chartArea;
        barY = baseY - barHeight;
        fillColor = '#2196F3'; // Blue
        strokeColor = '#1976D2';
      } else {
        // Increment bar floating
        const startY = baseY - (item.startValue / maxValue) * chartArea;
        const endY = baseY - (item.endValue / maxValue) * chartArea;
        barY = endY;
        barHeight = startY - endY;
        fillColor = '#66BB6A'; // Light green for positive increments
        strokeColor = '#4CAF50';
      }
      
      // Draw bar
      this.ctx.fillStyle = fillColor;
      this.ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Draw bar border
      // this.ctx.strokeStyle = strokeColor;
      // this.ctx.lineWidth = 2;
      // this.ctx.strokeRect(barX, barY, barWidth, barHeight);
      
      // // Draw value label on top of bar
      // this.ctx.fillStyle = '#333';
      // this.ctx.font = 'bold 11px Arial';
      // this.ctx.textAlign = 'center';
      // this.ctx.fillText(item.displayValue.toString(), barX + barWidth / 2, barY - 5);
      
      // // Draw connecting line to next bar
      // if (i < processedData.length - 1 && item.type !== 'end') {
      //   const nextItem = processedData[i + 1];
      //   if (nextItem.type !== 'start') {
      //     this.ctx.strokeStyle = '#999';
      //     this.ctx.lineWidth = 1;
      //     this.ctx.setLineDash([4, 4]);
          
      //     const currentEndY = baseY - (item.endValue / maxValue) * chartArea;
      //     const nextBarX = x + padding + (i + 1) * (barWidth + spacing);
          
      //     this.ctx.beginPath();
      //     this.ctx.moveTo(barX + barWidth, currentEndY);
      //     this.ctx.lineTo(nextBarX, currentEndY);
      //     this.ctx.stroke();
      //     this.ctx.setLineDash([]);
      //   }
      // }
      
      // // Draw x-axis labels
      // this.ctx.fillStyle = '#666';
      // this.ctx.font = '9px Arial';
      // this.ctx.textAlign = 'center';
      
      // Truncate long labels
      // let label = item.label;
      // if (label.length > 8) {
      //   label = label.substring(0, 6) + '...';
      // }
      
      // this.ctx.fillText(label, barX + barWidth / 2, baseY + 15);
    });
    
    // Draw x-axis line
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x + padding, baseY);
    this.ctx.lineTo(x + width - padding, baseY);
    this.ctx.stroke();
    
    // Draw y-axis line
    this.ctx.beginPath();
    this.ctx.moveTo(x + padding, y + titleHeight + padding);
    this.ctx.lineTo(x + padding, baseY + padding - 2);
    this.ctx.stroke();
  }
}
