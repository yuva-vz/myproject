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
  canvasVW = 20; // 20vw
  canvasVH = 20; // 20vh
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
    { type: 'pie', position: { h: '14vh', w: '22vw', x: '22vw', y: '0vh' } },
    { type: 'line', position: { h: '14vh', w: '22vw', x: '0vw', y: '0vh' } },
    { type: 'donut', position: { h: '20vh', w: '40vw', x: '0vw', y: '14vh' } },
    { type: 'card', position: { h: '5vh', w: '7vw', x: '44vw', y: '6vh' } },
    { type: 'funnel', position: { h: '22vh', w: '18vw', x: '40vw', y: '14vh' } },
    // { type: 'funnel', position: { h: '15vh', w: '20vw', x: '58vw', y: '0vh' } },
    // Add treemap chart
    // { type: 'treemap', position: { h: '12vh', w: '20vw', x: '0vw', y: '30vh' } },
    // New chart types
    // { type: 'area', position: { h: '12vh', w: '20vw', x: '0vw', y: '30vh' } },
    // { type: 'waterfall', position: { h: '12vh', w: '20vw', x: '22vw', y: '30vh' } },
    // { type: 'bubble', position: { h: '12vh', w: '20vw', x: '44vw', y: '30vh' } },
    // { type: 'radar', position: { h: '12vh', w: '20vw', x: '22vw', y: '44vh' } },
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
    { type: 'card', title: '4772', data: ['123.'] },
    { type: 'pie', title: 'Distribution', data: [30, 30, 30, 30, 30, 30] },
    { type: 'bar', title: 'Facility Stats', data: [15, 18, 27, 26, 16, 15, 34, 23, 22, 12] },
    { type: 'donut', title: 'User Types', data: [30, 30, 30, 30, 30] },
    { type: 'line', title: 'Revenue Growth', data: [100, 120, 110, 140, 160, 180, 200, 220, 210, 230] },
    { 
      type: 'table', 
      title: 'Performance Data', 
      data: [
    ['Facility.Name', 'Facility.City', 'State'], // ✅ Added "State" column in header
    ["Saint Mary's Hospital", 'Waterbury', 'CT'],
    ['Goodall Witcher Hospital', 'Clifton', 'TX'],
    ['Texas Childrens Hosp', 'Houston', 'TX'],
    ['Griffin Hospital', 'Derby', 'CT'],
    ['Mount Sinai Hospital', 'New York', 'NY'] // ✅ Added one more with third column
  ],

    },
    // Treemap chart data
    { 
      type: 'treemap', 
      title: 'Market Share',
      data: [
  { label: 'Memorial Hospital', value: 15, color: this.colors[0] },
  { label: 'Community Memorial Hospital', value: 8, color: this.colors[1] },
  { label: 'Good Samaritan Hospital', value: 7, color: this.colors[2] },
  { label: 'St Joseph Hospital', value: 7, color: this.colors[3] },
  { label: 'Memorial Medical Center', value: 6, color: this.colors[4] },
  { label: 'Shriners Hospitals For Children', value: 6, color: this.colors[5] },
  { label: 'St Francis Hospital', value: 6, color: this.colors[6] },
  { label: 'Mercy Hospital', value: 5, color: this.colors[7] },
  { label: 'St Joseph Medical Center', value: 5, color: this.colors[8] },
  { label: 'Community Hospital', value: 4, color: this.colors[9] }
],
      
    },
      
    // New chart types data
    { type: 'area', title: 'Area Chart', data: [20, 45, 35, 60, 50, 75, 65, 85] },
    { 
      type: 'waterfall', 
      title: 'Cash Flow', 
      data: [
        { label: 'Start', value: 100, type: 'start' },
        { label: 'Sales', value: 50, type: 'positive' },
        { label: 'Costs', value: -30, type: 'negative' },
        { label: 'Tax', value: -10, type: 'negative' },
        { label: 'Final', value: 110, type: 'end' }
      ]
    },
    { 
      type: 'bubble', 
      title: 'Bubble Chart', 
      data: [
        { x: 20, y: 30, size: 15, label: 'A' },
        { x: 40, y: 70, size: 25, label: 'B' },
        { x: 65, y: 45, size: 20, label: 'C' },
        { x: 80, y: 80, size: 30, label: 'D' }
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

//   constructor(private router: Router) {}
  
  // Handle escape key to exit full screen
//   @HostListener('document:keydown.escape', ['$event'])
//   onEscapeKey(event: KeyboardEvent) {
//     // this.exitFullScreen();
//   }
  
  // Handle click on canvas to show navigation
//   @HostListener('click', ['$event'])
//   onCanvasClick(event: MouseEvent) {
//     // Show a temporary navigation hint
//     // this.showNavigationHint();
//   }
  
//   exitFullScreen() {
//     this.router.navigate(['/image-dashboard']);
//   }
  
//   showNavigationHint() {
//     // Create a temporary overlay with navigation instructions
//     const overlay = document.createElement('div');
//     overlay.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       background: rgba(168, 162, 162, 0.8);
//       color: white;
//       padding: 10px 15px;
//       border-radius: 5px;
//       font-family: Arial, sans-serif;
//       font-size: 14px;
//       z-index: 1001;
//       pointer-events: none;
//     `;
//     // overlay.innerHTML = 'Press ESC to exit full screen';
//     document.body.appendChild(overlay);
    
//     setTimeout(() => {
//       document.body.removeChild(overlay);
//     }, 2000);
//   }
  
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    
    // Set canvas to fixed size for consistent rendering
    // canvas.width = 1800;
    // canvas.height = 1200;
    // canvas.width = document.documentElement.clientWidth;
    // canvas.height = document.documentElement.clientHeight;
    canvas.width = 378; // 378px    
    canvas.height = 200; // 210px


    // // Set canvas display size to match internal resolution
    // canvas.style.width = '100vw';
    // canvas.style.height = '100vh';
     canvas.style.width = '378px';
    canvas.style.height = '210px';


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
          this.drawTreemapChart(chart.data as any[], x, y, width, height);
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
      this.ctx.strokeStyle = '#45BD1';
      this.ctx.fillStyle = '#45BD1';
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
    this.ctx.fillStyle = 'black';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(value.toString(), x + width / 2, y + height / 2 + 8);

    // // Draw title
    // this.ctx.font = 'bold 10px Arial';
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

    //   // Cell text
    //   if (rowIdx === 0) {
    //     this.ctx.fillStyle = '#005DA6'; // Header text color
    //     this.ctx.font = 'bold 12px Arial';
    //   } else {
    //     this.ctx.fillStyle = '#333';
    //     this.ctx.font = '11px Arial';
    //   }
    //   this.ctx.textAlign = 'center';
    //   this.ctx.textBaseline = 'middle';

    //   // Wrap text if too long
    //   const text = cell.length > 20 ? cell.substring(0, 17) + '...' : cell;
    //   this.ctx.fillText(text, cellX + colWidth / 2, rowY + rowHeight / 2);
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

  // Waterfall Chart - Cumulative bars with increases/decreases
  drawWaterfallChart(data: any[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 10;
    const titleHeight = 20;
    const chartArea = height - titleHeight - padding * 2;
    const chartWidth = width - padding * 2;
    const barWidth = chartWidth / data.length - 2;
    
    // Draw background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeStyle = '#e1e5e9';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, width, height);

    // Draw title
    this.ctx.fillStyle = '#333';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(title, x + padding, y + titleHeight - 5);

    let cumulativeValue = 0;
    const maxCumulative = Math.max(...data.map((item, i) => {
      if (i === 0) return item.value;
      if (item.type === 'end') return item.value;
      cumulativeValue += item.value;
      return cumulativeValue;
    }));

    cumulativeValue = 0;
    const baseY = y + titleHeight + padding + chartArea;

    data.forEach((item, i) => {
      const barX = x + padding + i * (barWidth + 2);
      let barHeight: number;
      let barY: number;
      let color: string;

      if (item.type === 'start' || item.type === 'end') {
        barHeight = (item.value / maxCumulative) * chartArea;
        barY = baseY - barHeight;
        color = this.colors[4]; // Blue for start/end
        cumulativeValue = item.value;
      } else {
        const absValue = Math.abs(item.value);
        barHeight = (absValue / maxCumulative) * chartArea;
        
        if (item.value > 0) {
          barY = baseY - (cumulativeValue / maxCumulative) * chartArea - barHeight;
          color = this.colors[1]; // Green for positive
          cumulativeValue += item.value;
        } else {
          barY = baseY - (cumulativeValue / maxCumulative) * chartArea;
          color = this.colors[10]; // Red for negative
          cumulativeValue += item.value;
        }
      }

      // Draw bar
      this.ctx.fillStyle = color;
      this.ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Draw connecting line to next bar (except last)
      if (i < data.length - 1) {
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 2]);
        this.ctx.beginPath();
        this.ctx.moveTo(barX + barWidth, barY);
        this.ctx.lineTo(barX + barWidth + 2, barY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

      // Draw label
      this.ctx.fillStyle = '#666';
      this.ctx.font = '9px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(item.label, barX + barWidth / 2, baseY + 12);
    });
  }

  // Bubble Chart - Scatter plot with size dimension
  drawBubbleChart(data: any[], x: number, y: number, width: number, height: number, title: string) {
    const padding = 15;
    const titleHeight = 20;
    const chartArea = height - titleHeight - padding * 2;
    const chartWidth = width - padding * 2;
    
    // Draw background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeStyle = '#e1e5e9';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, width, height);

    // Draw title
    this.ctx.fillStyle = '#333';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(title, x + padding, y + titleHeight - 5);

    // Find ranges for scaling
    const maxX = Math.max(...data.map(d => d.x));
    const maxY = Math.max(...data.map(d => d.y));
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
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Draw label
      this.ctx.fillStyle = '#333';
      this.ctx.font = '10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(bubble.label, bubbleX, bubbleY + radius + 12);
    });

    // Draw simple axes
    this.ctx.strokeStyle = '#ccc';
    this.ctx.lineWidth = 1;
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

    // Draw title
    this.ctx.fillStyle = '#333';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, x + width / 2, y + titleHeight - 5);

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
      
      // Add label
      this.ctx.fillStyle = 'white';
      this.ctx.font = '10px Arial';
      this.ctx.textAlign = 'center';
      const labelX = x + width / 2;
      const labelY = segmentY + segmentHeight / 2 + 3;
      this.ctx.fillText(`${item.label}: ${item.value}`, labelX, labelY);
    });
  }

  // // Treemap Chart - Hierarchical data visualization with rectangles
  // drawTreemapChart(data: any[], x: number, y: number, width: number, height: number, title: string) {
  //   const padding = 10;
  //   const titleHeight = 20;
  //   const chartArea = height - titleHeight - padding * 2;
  //   const chartWidth = width - padding * 2;

  //   // Draw background
  //   // this.ctx.fillStyle = 'white';
  //   // this.ctx.fillRect(x, y, width, height);
  //   // this.ctx.strokeStyle = '#e1e5e9';
  //   // this.ctx.lineWidth = 1;
  //   // this.ctx.strokeRect(x, y, width, height);

  //   // // Draw title
  //   // this.ctx.fillStyle = '#333';
  //   // this.ctx.font = '12px Arial';
  //   // this.ctx.textAlign = 'left';
  //   // this.ctx.fillText(title, x + padding, y + titleHeight - 5);

  //   // Calculate total value for proportional sizing
  //   const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    
  //   // Simple squarified treemap algorithm
  //   const rectangles = this.calculateTreemapRectangles(data, x + padding, y + titleHeight + padding, chartWidth, chartArea, totalValue);

  //   // Draw rectangles
  //   rectangles.forEach((rect, i) => {
  //     // Draw rectangle
  //     this.ctx.fillStyle = rect.color || this.colors[i % this.colors.length];
  //     this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      
  //     // Draw border
  //     this.ctx.strokeStyle = 'white';
  //     this.ctx.lineWidth = 2;
  //     this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

  //     // // Draw label if rectangle is large enough
  //     // if (rect.width > 30 && rect.height > 20) {
  //     //   this.ctx.fillStyle = 'white';
  //     //   this.ctx.font = 'bold 10px Arial';
  //     //   this.ctx.textAlign = 'center';
        
  //     //   // Label
  //     //   this.ctx.fillText(
  //     //     rect.label, 
  //     //     rect.x + rect.width / 2, 
  //     //     rect.y + rect.height / 2 - 5
  //     //   );
        
  //     //   // Value
  //     //   this.ctx.font = '9px Arial';
  //     //   this.ctx.fillText(
  //     //     rect.value.toString(), 
  //     //     rect.x + rect.width / 2, 
  //     //     rect.y + rect.height / 2 + 8
  //     //   );
  //     // }
  //   });
  // }

  // // Helper method to calculate treemap rectangles using a simple layout algorithm
  // private calculateTreemapRectangles(data: any[], startX: number, startY: number, totalWidth: number, totalHeight: number, totalValue: number) {
  //   const rectangles: any[] = [];
  //   let currentX = startX;
  //   let currentY = startY;
  //   let remainingWidth = totalWidth;
  //   let remainingHeight = totalHeight;
    
  //   // Sort data by value (largest first) for better layout
  //   const sortedData = [...data].sort((a, b) => b.value - a.value);
    
  //   // Simple row-based layout
  //   let currentRowHeight = 0;
  //   let currentRowWidth = 0;
  //   let itemsInCurrentRow: any[] = [];
    
  //   sortedData.forEach((item, index) => {
  //     const area = (item.value / totalValue) * (totalWidth * totalHeight);
      
  //     if (itemsInCurrentRow.length === 0) {
  //       // Start new row
  //       currentRowHeight = Math.sqrt(area * (totalHeight / totalWidth));
  //       currentRowHeight = Math.min(currentRowHeight, remainingHeight);
  //     }
      
  //     const itemWidth = area / currentRowHeight;
      
  //     // Check if we should start a new row
  //     if (currentRowWidth + itemWidth > remainingWidth && itemsInCurrentRow.length > 0) {
  //       // Finalize current row
  //       this.finalizeTreemapRow(itemsInCurrentRow, currentX, currentY, currentRowWidth, currentRowHeight, rectangles);
        
  //       // Start new row
  //       currentY += currentRowHeight;
  //       remainingHeight -= currentRowHeight;
  //       currentX = startX;
  //       currentRowWidth = 0;
  //       itemsInCurrentRow = [];
        
  //       // Recalculate for new row
  //       currentRowHeight = Math.sqrt(area * (remainingHeight / totalWidth));
  //       currentRowHeight = Math.min(currentRowHeight, remainingHeight);
  //     }
      
  //     itemsInCurrentRow.push({
  //       ...item,
  //       width: itemWidth,
  //       height: currentRowHeight
  //     });
  //     currentRowWidth += itemWidth;
  //   });
    
  //   // Finalize last row
  //   if (itemsInCurrentRow.length > 0) {
  //     this.finalizeTreemapRow(itemsInCurrentRow, currentX, currentY, currentRowWidth, currentRowHeight, rectangles);
  //   }
    
  //   return rectangles;
  // }
    drawTreemapChart(data: any[], x: number, y: number, width: number, height: number) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  let currentX = x + 2;
  let currentY = y + 2;
  let remainingWidth = width;
  let remainingHeight = height;

  // Sort by value (largest first)
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // For simplicity, split into 2 rows dynamically
  let rows = 2;
  let rowHeight = remainingHeight / rows;

  sortedData.forEach((item, index) => {
    const area = (item.value / totalValue) * (width * height);
    const rectWidth = area / rowHeight;

    // If no space in current row → new row
    if (currentX + rectWidth > x + width) {
      currentX = x;
      currentY += rowHeight;
    }

    // Draw rectangle
    this.ctx.fillStyle = item.color;
    this.ctx.fillRect(currentX, currentY, rectWidth, rowHeight);
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(currentX, currentY, rectWidth, rowHeight);

    // Draw text inside
    // this.ctx.fillStyle = '#000';
    // this.ctx.font = '10px Arial';
    // this.ctx.textAlign = 'center';
    // this.ctx.textBaseline = 'middle';
    // this.ctx.fillText(item.label, currentX + rectWidth / 2, currentY + rowHeight / 2);

    currentX += rectWidth;
  });
}


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
}
