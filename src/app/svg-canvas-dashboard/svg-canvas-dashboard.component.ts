import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-svg-canvas-dashboard',
  templateUrl: './svg-canvas-dashboard.component.html',
  styleUrls: ['./svg-canvas-dashboard.component.scss']
})
export class SvgCanvasDashboardComponent implements AfterViewInit {

  // Canvas thumbnail functionality
  @ViewChild('thumbnailCanvas', { static: false }) thumbnailCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dashboardContainer', { static: false }) dashboardContainerRef!: ElementRef<HTMLDivElement>;
  
  isGenerating = false;
  canvasGenerated = false;
  thumbnailCtx!: CanvasRenderingContext2D;
  
  // Dashboard controls
  showThumbnail = false;
  thumbnailSize = { width: 219, height: 149 };

  // Layout data - same as samplesvg component
  originalLayout = [
    { type: 'card', position: { h: '5vh', w: '7vw', x: '44vw', y: '0vh' } },
    { type: 'bar', position: { h: '14vh', w: '22vw', x: '22vw', y: '0vh' } },
    { type: 'pie', position: { h: '14vh', w: '22vw', x: '0vw', y: '0vh' } },
    { type: 'bar', position: { h: '14vh', w: '40vw', x: '0vw', y: '14vh' } },
    { type: 'card', position: { h: '5vh', w: '7vw', x: '44vw', y: '6vh' } },
    { type: 'table', position: { h: '16vh', w: '18vw', x: '40vw', y: '14vh' } },
  ];

  REF_HEIGHT = 60;
  REF_WIDTH = 60;

  chartInfo = [
    { type: 'card', title: '4772', data: ['123.'] },
    { type: 'pie', title: 'Distribution', data: [30, 30, 30, 30, 30, 30] },
    { type: 'bar', title: 'Facility Stats', data: [15, 8, 7, 7, 6, 5, 4, 3, 2, 1] },
    { type: 'donut', title: 'User Types', data: [40, 30, 20, 10, 15, 12, 8, 5, 7, 3] },
    { type: 'area', title: 'User Growth', data: [10, 20, 30, 40, 50, 60, 55, 65, 70, 80] },
    { type: 'line', title: 'Revenue Growth', data: [100, 120, 110, 140, 160, 180, 200, 220, 210, 230] },
    { 
      type: 'table', 
      title: 'Performance Data', 
      data: [
        ['Facility.Name', 'Facility.City'],
        ["Saint Mary's Hospital", 'Waterbury'],
        ['Goodall Witcher Hospital', 'Clifton'],
        ['Yale-New Haven Hospital', 'New Haven'],
        ['Texas Childrens Hosp', 'Houston'],
        ['Griffin Hospital', 'Derby'],
      ]
    },
  ];

  colors = [
    "#005DA6", "#FFC52F", "#BAE1FF", "#75C2FF", "#30A4FF", "#00467D",
    "#CBC53E", "#089AD7", "#6D6E71", "#D0CECE", "#DE354C", "#932432",
    "#3C1874", "#283747", "#DDAF94", "#E8CEBF", "#f43a09", "#c2edda", "#fbe3e8"
  ];

  layoutData: any[] = [];

  ngAfterViewInit() {
    // Normalize layout and merge with chart info
    this.normalizeLayout();
    this.mergeLayoutWithChartInfo();
    
    setTimeout(() => {
      this.renderAllCharts();
    }, 100);
  }

  // Normalize layout to percentages
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

  // ✅ SVG to Canvas Conversion Methods
  
  async generateCanvasThumbnail() {
    this.isGenerating = true;
    this.canvasGenerated = false;

    try {
      // Wait a bit for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the dashboard container
      const dashboardElement = this.dashboardContainerRef.nativeElement;
      
      // Create canvas if it doesn't exist
      if (!this.thumbnailCanvasRef?.nativeElement) {
        console.error('Canvas element not found');
        return;
      }

      const canvas = this.thumbnailCanvasRef.nativeElement;
      const ctx = canvas.getContext('2d')!;
      this.thumbnailCtx = ctx;

      // Set canvas dimensions
      canvas.width = this.thumbnailSize.width;
      canvas.height = this.thumbnailSize.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG dashboard to canvas
      await this.convertSvgToCanvas(dashboardElement, ctx);

      this.canvasGenerated = true;
      this.showThumbnail = true;

    } catch (error) {
      console.error('Error generating canvas thumbnail:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  async convertSvgToCanvas(dashboardElement: HTMLElement, ctx: CanvasRenderingContext2D) {
    // Get all SVG elements from the dashboard
    const svgElements = dashboardElement.querySelectorAll('svg');
    
    // Calculate scale factors
    const dashboardRect = dashboardElement.getBoundingClientRect();
    const scaleX = this.thumbnailSize.width / dashboardRect.width;
    const scaleY = this.thumbnailSize.height / dashboardRect.height;

    // Process each SVG element
    for (const svgElement of Array.from(svgElements)) {
      await this.drawSvgOnCanvas(svgElement as SVGElement, ctx, scaleX, scaleY, dashboardRect);
    }
  }

  async drawSvgOnCanvas(svgElement: SVGElement, ctx: CanvasRenderingContext2D, scaleX: number, scaleY: number, dashboardRect: DOMRect) {
    try {
      // Get SVG position relative to dashboard
      const svgRect = svgElement.getBoundingClientRect();
      const relativeX = (svgRect.left - dashboardRect.left) * scaleX;
      const relativeY = (svgRect.top - dashboardRect.top) * scaleY;
      const scaledWidth = svgRect.width * scaleX;
      const scaledHeight = svgRect.height * scaleY;

      // Create a temporary canvas for this SVG
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCanvas.width = scaledWidth;
      tempCanvas.height = scaledHeight;

      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create image and draw on canvas
      const img = new Image();
      
      return new Promise<void>((resolve) => {
        img.onload = () => {
          // Draw the SVG image on the temporary canvas
          tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
          
          // Draw the temporary canvas on the main canvas
          ctx.drawImage(tempCanvas, relativeX, relativeY);
          
          URL.revokeObjectURL(svgUrl);
          resolve();
        };
        
        img.onerror = () => {
          console.warn('Failed to load SVG as image');
          URL.revokeObjectURL(svgUrl);
          resolve();
        };
        
        img.src = svgUrl;
      });

    } catch (error) {
      console.error('Error drawing SVG on canvas:', error);
    }
  }

  // Alternative method: Direct canvas drawing (faster but requires chart recreation)
  async generateCanvasDirectly() {
    this.isGenerating = true;
    this.canvasGenerated = false;

    try {
      const canvas = this.thumbnailCanvasRef.nativeElement;
      const ctx = canvas.getContext('2d')!;
      this.thumbnailCtx = ctx;

      // Set canvas dimensions
      canvas.width = this.thumbnailSize.width;
      canvas.height = this.thumbnailSize.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw charts directly on canvas
      await this.drawChartsOnCanvas(ctx);

      this.canvasGenerated = true;
      this.showThumbnail = true;

    } catch (error) {
      console.error('Error generating canvas directly:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  async drawChartsOnCanvas(ctx: CanvasRenderingContext2D) {
    // Iterate through layout data and draw each chart
    this.layoutData.forEach((chart, index) => {
      const width = this.convertToPxForCanvas(chart.position.w, 'width');
      const height = this.convertToPxForCanvas(chart.position.h, 'height');
      const x = this.convertToPxForCanvas(chart.position.x, 'width');
      const y = this.convertToPxForCanvas(chart.position.y, 'height');

      // Draw chart background
      ctx.fillStyle = 'white';
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = '#e1e5e9';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);

      // Draw chart based on type
      switch (chart.type) {
        case 'bar':
          this.drawBarChartOnCanvas(ctx, x, y, width, height, chart.data as number[], index);
          break;
        case 'pie':
          this.drawPieChartOnCanvas(ctx, x, y, width, height, chart.data as number[], index);
          break;
        case 'card':
          this.drawCardOnCanvas(ctx, x, y, width, height, chart.data[0], chart.title);
          break;
        case 'table':
          this.drawTableOnCanvas(ctx, x, y, width, height, chart.data as string[][]);
          break;
      }
    });
  }

  // Canvas drawing methods for different chart types
  drawBarChartOnCanvas(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, data: number[], index: number) {
    const padding = 5;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length - 2;
    const maxValue = Math.max(...data);

    data.forEach((value, i) => {
      const barHeight = (value / maxValue) * chartHeight;
      const barX = x + padding + i * (barWidth + 2);
      const barY = y + height - padding - barHeight;
      
      ctx.fillStyle = this.colors[0];
      ctx.fillRect(barX, barY, barWidth, barHeight);
    });
  }

  drawPieChartOnCanvas(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, data: number[], index: number) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = Math.min(width, height) / 2 - 5;
    const total = data.reduce((sum, val) => sum + val, 0);
    
    let startAngle = 0;
    data.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.fill();
      
      startAngle += sliceAngle;
    });
  }

  drawCardOnCanvas(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, value: any, title: string) {
    // Draw card background
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    // Draw value text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.min(width, height) * 0.3}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(value.toString(), x + width / 2, y + height / 2 + 5);
  }

  drawTableOnCanvas(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, data: string[][]) {
    const cellWidth = width / data[0].length;
    const cellHeight = height / data.length;

    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellX = x + colIndex * cellWidth;
        const cellY = y + rowIndex * cellHeight;
        
        // Draw cell border
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(cellX, cellY, cellWidth, cellHeight);
        
        // Draw header background
        if (rowIndex === 0) {
          ctx.fillStyle = '#f8f9fa';
          ctx.fillRect(cellX, cellY, cellWidth, cellHeight);
        }
      });
    });
  }

  // Export functions
  downloadCanvasAsImage() {
    if (!this.canvasGenerated || !this.thumbnailCanvasRef?.nativeElement) {
      console.error('Canvas not generated yet');
      return;
    }

    const canvas = this.thumbnailCanvasRef.nativeElement;
    const link = document.createElement('a');
    link.download = 'dashboard-thumbnail.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  copyCanvasToClipboard() {
    if (!this.canvasGenerated || !this.thumbnailCanvasRef?.nativeElement) {
      console.error('Canvas not generated yet');
      return;
    }

    const canvas = this.thumbnailCanvasRef.nativeElement;
    canvas.toBlob((blob) => {
      if (blob && navigator.clipboard) {
        navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]).then(() => {
          console.log('Canvas copied to clipboard');
        }).catch(err => {
          console.error('Failed to copy to clipboard:', err);
        });
      }
    });
  }

  // Utility methods (same as samplesvg component)
  convertToPx(value: string): number {
    if (value.endsWith('vh')) {
      return (parseFloat(value) / 100) * window.innerHeight + 20;
    } else if (value.endsWith('vw')) {
      return (parseFloat(value) / 100) * window.innerWidth + 20;
    } else if (value.endsWith('px')) {
      return parseFloat(value);
    } else {
      const num = parseFloat(value);
      return isNaN(num) ? 300 : num;
    }
  }

  convertToPxForCanvas(value: string, dimension: 'width' | 'height'): number {
    if (value.endsWith('vh')) {
      return (parseFloat(value) / 100) * this.thumbnailSize.height;
    } else if (value.endsWith('vw')) {
      return (parseFloat(value) / 100) * this.thumbnailSize.width;
    } else if (value.endsWith('px')) {
      return parseFloat(value) * (dimension === 'width' ? 
        this.thumbnailSize.width / window.innerWidth : 
        this.thumbnailSize.height / window.innerHeight);
    }
    return parseFloat(value) || 50;
  }

  // All the chart rendering methods from samplesvg component
  renderAllCharts() {
    this.layoutData.forEach((chart, index) => {
      const id = `chart-${chart.type}-${index}`;
      const svgElement = document.getElementById(id);
      
      if (!svgElement || !(svgElement instanceof SVGElement)) {
        console.warn(`SVG element with ID ${id} not found`);
        return;
      }

      const svg = svgElement as SVGElement;
      const width = this.convertToPx(chart.position.w);
      const height = this.convertToPx(chart.position.h);

      if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        console.error(`Invalid dimensions for chart ${id}: width=${width}, height=${height}`);
        return;
      }

      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      switch (chart.type) {
        case 'bar':
          this.renderBarChart(svg, width, height, chart.data as number[], index);
          break;
        case 'pie':
          this.renderPieChart(svg, width, height, chart.data as number[], index);
          break;
        case 'card':
          this.renderCardChart(svg, width, height, chart.data as number[], chart.title, index);
          break;
        case 'table':
          this.renderTableChart(svg, width, height, chart.data as string[][], chart.title, index);
          break;
      }
    });
  }

  // SVG Chart rendering methods (simplified versions)
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
      rect.setAttribute('fill', this.colors[0]);
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

  renderCardChart(svg: SVGElement, width: number, height: number, data: (number | string)[], title: string, chartIndex: number) {
    const value = data[0];
    
    const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', (width / 2).toString());
    valueText.setAttribute('y', (height / 2).toString());
    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('dominant-baseline', 'middle');
    valueText.setAttribute('font-size', Math.min(width, height) * 0.3 + 'px');
    valueText.setAttribute('font-weight', 'bold');
    valueText.setAttribute('fill', '#000');
    valueText.textContent = value.toString();
    svg.appendChild(valueText);
  }

  renderTableChart(svg: SVGElement, width: number, height: number, data: string[][], title: string, chartIndex: number) {
    const padding = { left: 5, right: 5, top: 20, bottom: 5 };
    const tableWidth = width - padding.left - padding.right;
    const tableHeight = height - padding.top - padding.bottom;
    const rowCount = data.length;
    const colCount = data[0]?.length || 0;
    const rowHeight = tableHeight / rowCount;
    const colWidth = tableWidth / colCount;

    data.forEach((row, rowIndex) => {
      const y = padding.top + rowIndex * rowHeight;
      
      row.forEach((cell, colIndex) => {
        const x = padding.left + colIndex * colWidth;
        
        const cellBorder = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        cellBorder.setAttribute('x', x.toString());
        cellBorder.setAttribute('y', y.toString());
        cellBorder.setAttribute('width', colWidth.toString());
        cellBorder.setAttribute('height', rowHeight.toString());
        cellBorder.setAttribute('fill', 'none');
        cellBorder.setAttribute('stroke', '#000000');
        cellBorder.setAttribute('stroke-width', '0.5');
        svg.appendChild(cellBorder);
      });

      if (rowIndex === 0) {
        const headerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        headerLine.setAttribute('x1', padding.left.toString());
        headerLine.setAttribute('y1', (y + rowHeight).toString());
        headerLine.setAttribute('x2', (padding.left + tableWidth).toString());
        headerLine.setAttribute('y2', (y + rowHeight).toString());
        headerLine.setAttribute('stroke', '#333');
        headerLine.setAttribute('stroke-width', '2');
        svg.appendChild(headerLine);
      }
    });

    for (let i = 0; i <= colCount; i++) {
      const x = padding.left + i * colWidth;
      const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      verticalLine.setAttribute('x1', x.toString());
      verticalLine.setAttribute('y1', padding.top.toString());
      verticalLine.setAttribute('x2', x.toString());
      verticalLine.setAttribute('y2', (padding.top + tableHeight).toString());
      verticalLine.setAttribute('stroke', '#000000');
      verticalLine.setAttribute('stroke-width', i === 0 || i === colCount ? '1' : '0.5');
      svg.appendChild(verticalLine);
    }
  }
}
