// // import { AfterViewInit, Component, ElementRef, ViewChildren, QueryList, HostListener, OnDestroy } from '@angular/core';

// // interface ChartData {
// //   type: string;
// //   title: string;
// //   data: any[];
// //   position: {
// //     x: number;
// //     y: number;
// //     width: number;
// //     height: number;
// //   };
// // }

// // interface DashboardConfig {
// //   id: number;
// //   charts: ChartData[];
// //   theme: string;
// // }

// // @Component({
// //   selector: 'app-grid-canvas-dashboard',
// //   templateUrl: './grid-canvas-dashboard.component.html',
// //   styleUrls: ['./grid-canvas-dashboard.component.scss']
// // })
// // export class GridCanvasDashboardComponent implements AfterViewInit, OnDestroy {
// //   @ViewChildren('dashboardCanvas') canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;
  
// //   gridSize = 50;
// //   canvasWidth = 300;
// //   canvasHeight = 200;
// //   dashboards: DashboardConfig[] = [];
// //   gridColumns = '';
  
// //   private resizeTimeout: any;
  
// //   colors = [
// //     "#005DA6", "#FFC52F", "#BAE1FF", "#75C2FF", "#30A4FF", "#00467D",
// //     "#CBC53E", "#089AD7", "#6D6E71", "#D0CECE", "#DE354C", "#932432",
// //     "#3C1874", "#283747", "#DDAF94", "#E8CEBF", "#f43a09", "#c2edda", "#fbe3e8"
// //   ];

// //   themes = [
// //     { name: 'blue', colors: ["#005DA6", "#75C2FF", "#30A4FF", "#BAE1FF"] },
// //     { name: 'warm', colors: ["#FFC52F", "#f43a09", "#DE354C", "#DDAF94"] },
// //     { name: 'cool', colors: ["#089AD7", "#3C1874", "#c2edda", "#fbe3e8"] },
// //     { name: 'neutral', colors: ["#6D6E71", "#D0CECE", "#283747", "#E8CEBF"] }
// //   ];

// //   chartTypes = ['bar', 'pie', 'donut', 'line', 'card'];
  
// //   ngAfterViewInit() {
// //     this.initializeDashboards();
// //     this.updateGridColumns();
// //     setTimeout(() => {
// //       this.renderAllDashboards();
// //     }, 100);
// //   }

// //   ngOnDestroy() {
// //     if (this.resizeTimeout) {
// //       clearTimeout(this.resizeTimeout);
// //     }
// //     window.removeEventListener('resize', this.onWindowResize);
// //   }

// //   @HostListener('window:resize', ['$event'])
// //   onWindowResize(event: any) {
// //     // Debounce resize events for better performance
// //     if (this.resizeTimeout) {
// //       clearTimeout(this.resizeTimeout);
// //     }
    
// //     this.resizeTimeout = setTimeout(() => {
// //       this.updateCanvasSize();
// //       this.renderAllDashboards();
// //     }, 150);
// //   }

// //   initializeDashboards() {
// //     this.dashboards = [];
// //     for (let i = 0; i < this.gridSize; i++) {
// //       this.dashboards.push(this.generateRandomDashboard(i));
// //     }
// //   }

// //   generateRandomDashboard(id: number): DashboardConfig {
// //     const numCharts = Math.floor(Math.random() * 4) + 2; // 2-5 charts per dashboard
// //     const charts: ChartData[] = [];
// //     const theme = this.themes[Math.floor(Math.random() * this.themes.length)];
    
// //     // Create a simple grid layout for charts within each dashboard
// //     const gridCols = Math.ceil(Math.sqrt(numCharts));
// //     const chartWidth = this.canvasWidth / gridCols;
// //     const chartHeight = this.canvasHeight / Math.ceil(numCharts / gridCols);
    
// //     for (let j = 0; j < numCharts; j++) {
// //       const row = Math.floor(j / gridCols);
// //       const col = j % gridCols;
      
// //       charts.push({
// //         type: this.chartTypes[Math.floor(Math.random() * this.chartTypes.length)],
// //         title: `Chart ${j + 1}`,
// //         data: this.generateRandomData(this.chartTypes[Math.floor(Math.random() * this.chartTypes.length)]),
// //         position: {
// //           x: col * chartWidth,
// //           y: row * chartHeight,
// //           width: chartWidth - 5, // Small margin
// //           height: chartHeight - 5
// //         }
// //       });
// //     }
    
// //     return {
// //       id,
// //       charts,
// //       theme: theme.name
// //     };
// //   }

// //   generateRandomData(chartType: string): any[] {
// //     switch (chartType) {
// //       case 'bar':
// //       case 'line':
// //         return Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 10);
// //       case 'pie':
// //       case 'donut':
// //         return Array.from({ length: 4 }, () => Math.floor(Math.random() * 50) + 10);
// //       case 'card':
// //         return [Math.floor(Math.random() * 10000)];
// //       default:
// //         return [];
// //     }
// //   }

// //   updateGridColumns() {
// //     const containerWidth = window.innerWidth - 40; // Account for padding
// //     const itemWidth = 320; // Minimum width including padding
// //     const cols = Math.floor(containerWidth / itemWidth);
// //     this.gridColumns = `repeat(${Math.max(1, cols)}, 1fr)`;
// //   }

// //   updateCanvasSize() {
// //     this.updateGridColumns();
// //     // Canvas size remains fixed for consistency
// //     // but we could make it responsive if needed
// //   }

// //   renderAllDashboards() {
// //     if (!this.canvasElements) return;
    
// //     this.canvasElements.forEach((canvasRef, index) => {
// //       if (index < this.dashboards.length) {
// //         this.renderDashboard(canvasRef.nativeElement, this.dashboards[index]);
// //       }
// //     });
// //   }

// //   renderDashboard(canvas: HTMLCanvasElement, dashboard: DashboardConfig) {
// //     const ctx = canvas.getContext('2d');
// //     if (!ctx) return;

// //     // Clear canvas
// //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
// //     // Set background
// //     ctx.fillStyle = '#f8f9fa';
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);

// //     // Get theme colors
// //     const themeColors = this.themes.find(t => t.name === dashboard.theme)?.colors || this.colors;

// //     // Render each chart
// //     dashboard.charts.forEach((chart, index) => {
// //       const { x, y, width, height } = chart.position;
      
// //       // Draw chart background
// //       ctx.fillStyle = 'white';
// //       ctx.fillRect(x, y, width, height);
// //       ctx.strokeStyle = '#e1e5e9';
// //       ctx.lineWidth = 1;
// //       ctx.strokeRect(x, y, width, height);

// //       // Render chart based on type
// //       switch (chart.type) {
// //         case 'bar':
// //           this.drawBarChart(ctx, chart.data as number[], x, y, width, height, themeColors);
// //           break;
// //         case 'pie':
// //           this.drawPieChart(ctx, chart.data as number[], x, y, width, height, themeColors);
// //           break;
// //         case 'donut':
// //           this.drawDonutChart(ctx, chart.data as number[], x, y, width, height, themeColors);
// //           break;
// //         case 'line':
// //           this.drawLineChart(ctx, chart.data as number[], x, y, width, height, themeColors);
// //           break;
// //         case 'card':
// //           this.drawCard(ctx, chart.data[0], x, y, width, height, themeColors[0]);
// //           break;
// //       }
// //     });
// //   }

// //   drawBarChart(ctx: CanvasRenderingContext2D, data: number[], x: number, y: number, width: number, height: number, colors: string[]) {
// //     const padding = 5;
// //     const chartArea = height - padding * 2;
// //     const chartWidth = width - padding * 2;
// //     const barWidth = chartWidth / data.length - 2;
// //     const maxValue = Math.max(...data);

// //     data.forEach((val, i) => {
// //       const barHeight = (val / maxValue) * chartArea;
// //       const barX = x + padding + i * (barWidth + 2);
// //       const barY = y + padding + (chartArea - barHeight);
      
// //       ctx.fillStyle = colors[i % colors.length];
// //       ctx.fillRect(barX, barY, barWidth, barHeight);
// //     });
// //   }

// //   drawPieChart(ctx: CanvasRenderingContext2D, data: number[], x: number, y: number, width: number, height: number, colors: string[]) {
// //     const radius = Math.min(width, height) / 2 - 10;
// //     const centerX = x + width / 2;
// //     const centerY = y + height / 2;
// //     const total = data.reduce((a, b) => a + b, 0);

// //     let startAngle = -Math.PI / 2;
// //     data.forEach((val, i) => {
// //       const sliceAngle = (val / total) * 2 * Math.PI;
      
// //       ctx.beginPath();
// //       ctx.moveTo(centerX, centerY);
// //       ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
// //       ctx.closePath();
// //       ctx.fillStyle = colors[i % colors.length];
// //       ctx.fill();
// //       ctx.strokeStyle = 'white';
// //       ctx.lineWidth = 1;
// //       ctx.stroke();
      
// //       startAngle += sliceAngle;
// //     });
// //   }

// //   drawDonutChart(ctx: CanvasRenderingContext2D, data: number[], x: number, y: number, width: number, height: number, colors: string[]) {
// //     const outerRadius = Math.min(width, height) / 2 - 10;
// //     const innerRadius = outerRadius * 0.6;
// //     const centerX = x + width / 2;
// //     const centerY = y + height / 2;
// //     const total = data.reduce((a, b) => a + b, 0);

// //     let startAngle = -Math.PI / 2;
// //     data.forEach((val, i) => {
// //       const sliceAngle = (val / total) * 2 * Math.PI;
      
// //       ctx.beginPath();
// //       ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
// //       ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
// //       ctx.closePath();
// //       ctx.fillStyle = colors[i % colors.length];
// //       ctx.fill();
// //       ctx.strokeStyle = 'white';
// //       ctx.lineWidth = 1;
// //       ctx.stroke();
      
// //       startAngle += sliceAngle;
// //     });
// //   }

// //   drawLineChart(ctx: CanvasRenderingContext2D, data: number[], x: number, y: number, width: number, height: number, colors: string[]) {
// //     const padding = 5;
// //     const chartArea = height - padding * 2;
// //     const chartWidth = width - padding * 2;
// //     const maxValue = Math.max(...data);
// //     const stepX = chartWidth / (data.length - 1);

// //     ctx.beginPath();
// //     data.forEach((val, idx) => {
// //       const pointX = x + padding + idx * stepX;
// //       const pointY = y + padding + (chartArea - (val / maxValue) * chartArea);
      
// //       if (idx === 0) {
// //         ctx.moveTo(pointX, pointY);
// //       } else {
// //         ctx.lineTo(pointX, pointY);
// //       }
// //     });
// //     ctx.strokeStyle = colors[0];
// //     ctx.lineWidth = 2;
// //     ctx.stroke();

// //     // Draw points
// //     data.forEach((val, idx) => {
// //       const pointX = x + padding + idx * stepX;
// //       const pointY = y + padding + (chartArea - (val / maxValue) * chartArea);
      
// //       ctx.beginPath();
// //       ctx.arc(pointX, pointY, 2, 0, Math.PI * 2);
// //       ctx.fillStyle = colors[1] || colors[0];
// //       ctx.fill();
// //     });
// //   }

// //   drawCard(ctx: CanvasRenderingContext2D, value: number, x: number, y: number, width: number, height: number, color: string) {
// //     ctx.fillStyle = color;
// //     ctx.font = 'bold 16px Arial';
// //     ctx.textAlign = 'center';
// //     ctx.fillText(value.toString(), x + width / 2, y + height / 2 + 6);
// //   }

// //   changeGridSize(size: number) {
// //     this.gridSize = size;
// //     this.initializeDashboards();
// //     this.updateGridColumns();
// //     setTimeout(() => {
// //       this.renderAllDashboards();
// //     }, 100);
// //   }

// //   regenerateAllDashboards() {
// //     this.initializeDashboards();
// //     setTimeout(() => {
// //       this.renderAllDashboards();
// //     }, 100);
// //   }
// }
