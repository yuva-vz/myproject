import { ElementRef } from '@angular/core';

// interface SeriesType {
//   series_type: string[];
// }
interface IComponent { x: number; y: number; width: number; height: number; component_type: string; series_type: string[]; }

export class Thumbnail {
private canvas: HTMLCanvasElement; private ctx: CanvasRenderingContext2D; private scaleX = 1; private scaleY = 1; private componentsData: IComponent[]; private readonly elementRef: ElementRef<HTMLDivElement>;
// Dynamic color palette
  constructor(
    elementRef: ElementRef<HTMLDivElement>,
    componentsData: IComponent[]
  ) {
    this.componentsData = componentsData;
    this.elementRef = elementRef;
    // Create canvas and context
    this.canvas = elementRef.nativeElement.appendChild(
      document.createElement('canvas')
    );
    this.ctx = this.canvas.getContext('2d')!;
    this.resizeCanvas();
    this.calculateScales();
    window.addEventListener('resize', () => this.handleResize());
    this.render();
  }

  private resizeCanvas(): void {
    this.canvas.width = this.elementRef.nativeElement.clientWidth;
    this.canvas.height = this.elementRef.nativeElement.clientHeight - 6;
  }

  private calculateScales(): void {
    // Find max x and y coordinates for scaling
    const maxX = 60;
    const maxY = 60;
    this.scaleX = this.elementRef.nativeElement.clientWidth / maxX ;
    this.scaleY = this.elementRef.nativeElement.clientHeight / maxY ;
  }

  private handleResize(): void {
    this.resizeCanvas();
    this.calculateScales();
    this.render();
  }

// private colors = ['#005DA6', '#FFC52F', '#BAE1FF', '#75C2FF', '#30A4FF', '#00467D', '#CBC53E', '#089AD7', '#6D6E71', '#D0CECE', '#DE354C', '#932432', '#3C1874', '#283747', '#DDAF94'];

//   // ---------- UTILITIES ----------
//   private getRandomData(count: number, min = 10, max = 100): number[] {
//     return Array.from({ length: count }, () =>
//       Math.floor(Math.random() * (max - min) + min)
//     );
//   }
//   private setStroke(color: string, width = 2) {
//     this.ctx.strokeStyle = color;
//     this.ctx.lineWidth = width;
//   }
//   private setFill(color: string) {
//     this.ctx.fillStyle = color;
//   }

//   // ---------- COMBINED CHART FUNCTIONS ----------

//   // Line & Area
// private drawLineOrAreaChart(x: number, y: number, w: number, h: number, color: string, isArea: boolean): void {
//     const points = 8,
//       stepX = w / (points - 1);
//     const coords = Array.from({ length: points }, (_, i) => ({
//       x: x + i * stepX,
//       y: y + Math.random() * h,
//     }));
//     this.ctx.beginPath();
//     this.setStroke(color);
//     this.ctx.moveTo(coords[0].x, coords[0].y);
//     coords.forEach((p, i) => i && this.ctx.lineTo(p.x, p.y));
//     if (isArea) {
//       this.ctx.lineTo(coords.at(-1)!.x, y + h);
//       this.ctx.lineTo(coords[0].x, y + h);
//       this.ctx.closePath();
//       this.setFill(color + '40');
//       this.ctx.fill();
//     }
//     this.ctx.stroke();
//   }

//   // //   private drawScatterChart(
//   // //     x: number,
//   // //     y: number,
//   // //     width: number,
//   // //     height: number,
//   // //     color: string
//   // //   ): void {
//   // //     const points = 12;
//   // //     this.ctx.fillStyle = color;

//   // //     for (let i = 0; i < points; i++) {
//   // //       const pointX = x + Math.random() * width;
//   // //       const pointY = y + Math.random() * height;
//   // //       const radius = 2;

//   // //       this.ctx.beginPath();
//   // //       this.ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
//   // //       this.ctx.fill();
//   // //     }
//   // //   }
//   private drawTreemapChart(x: number, y: number, w: number, h: number): void {
//     const areas = [0.4, 0.4, 0.25, 1]; // Example proportions
// 	let curX = x, curY = y, remW = w, remH = h;
//     this.ctx.lineWidth = 1;
//     this.ctx.strokeStyle = '#fff';
//     areas.forEach((a, i) => {
//       const isHorizontal = i % 2 === 0;
//       const rectW = isHorizontal ? remW * a : remW;
//       const rectH = isHorizontal ? remH : remH * a;

//       this.ctx.fillStyle = this.colors[i % this.colors.length];
//       this.ctx.fillRect(curX, curY, rectW, rectH);
//       this.ctx.strokeRect(curX, curY, rectW, rectH);

//       if (isHorizontal) {
//         curX += rectW;
//         remW -= rectW;
//       } else {
//         curY += rectH;
//         remH -= rectH;
//       }
//     });
//   }

//   // Pie & Donut
// private drawPieOrDonutChart(x: number, y: number, w: number, h: number, isDonut: boolean): void {
//     const data = this.getRandomData(6),
//       total = data.reduce((a, b) => a + b, 0);
//     const R = Math.min(w, h) / 2,
//       r = isDonut ? R / 2 : 0,
//       cx = x + w / 2,
//       cy = y + h / 2;
//     let angle = 0;
//     data.forEach((val, i) => {
//       const slice = (val / total) * Math.PI * 2;
//       this.ctx.beginPath();
//       this.ctx.arc(cx, cy, R, angle, angle + slice);
//       isDonut
//         ? this.ctx.arc(cx, cy, r, angle + slice, angle, true)
//         : this.ctx.lineTo(cx, cy);
//       this.ctx.closePath();
//       this.setFill(this.colors[i % this.colors.length]);
//       this.ctx.fill();
//       angle += slice;
//     });
//   }

//   // Bar / Column
//   private drawBarChart(x: number, y: number, w: number, h: number): void {
//     const bars = 6,
//       barW = w / bars;
//     for (let i = 0; i < bars; i++) {
//       const bh = Math.random() * (h * 0.8);
//       this.setFill(this.colors[i % this.colors.length]);
//       this.ctx.fillRect(x + i * barW, y + h - bh, barW - 2, bh);
//     }
//   }

//   // Bubble
//   private drawBubbleChart(x: number, y: number, w: number, h: number): void {
//     const bubbles = 8;
//     for (let i = 0; i < bubbles; i++) {
//       const bx = x + Math.random() * w,
//         by = y + Math.random() * h;
//       const radius = Math.random() * (Math.min(w, h) * 0.15) + 3;
//       this.setFill(this.colors[i % this.colors.length] + '80');
//       this.ctx.beginPath();
//       this.ctx.arc(bx, by, radius, 0, 2 * Math.PI);
//       this.ctx.fill();
//       this.setStroke(this.colors[i % this.colors.length], 1);
//       this.ctx.stroke();
//     }
//   }

//   // Waterfall
//   private drawWaterfallChart(x: number, y: number, w: number, h: number): void {
//     const bars = 5,
//       barW = w / bars + 6;
//     let currentHeight = h * 0.3;
//     for (let i = 0; i < bars; i++) {
//       const change = h * 0.1,
//         bh = Math.abs(change) + 3;
//       const barX = x + i * barW + 2;
//       const barY = i === 0 ? y + h - currentHeight : y + h - currentHeight - bh;
//       this.setFill(this.colors[i % this.colors.length]);
//       this.ctx.fillRect(barX, barY, barW - 4, bh);
//       currentHeight += change + 1;
//     }
//   }

//   // Radar
// private drawRadarChart(x: number, y: number, w: number, h: number, color: string): void {
//     const cx = x + w / 2,
//       cy = y + h / 2,
//       R = Math.min(w, h) / 2 - 5,
//       axes = 6;
//     this.setStroke('#ddd');
//     for (let i = 0; i < axes; i++) {
//       const angle = (i / axes) * 2 * Math.PI - Math.PI / 2;
//       this.ctx.beginPath();
//       this.ctx.moveTo(cx, cy);
//       this.ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
//       this.ctx.stroke();
//     }
//     this.ctx.beginPath();
//     this.setFill(color + '40');
//     this.setStroke(color);
//     for (let i = 0; i < axes; i++) {
//       const angle = (i / axes) * 2 * Math.PI - Math.PI / 2;
//       const val = Math.random() * 0.8 + 0.2;
//       const px = cx + Math.cos(angle) * R * val,
//         py = cy + Math.sin(angle) * R * val;
//       i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
//     }
//     this.ctx.closePath();
//     this.ctx.fill();
//     this.ctx.stroke();
//   }

//   // Funnel
//   private drawFunnelChart(x: number, y: number, w: number, h: number): void {
//     const stages = 4,
//       sh = h / stages;
//     for (let i = 0; i < stages; i++) {
//       const tW = w * (1 - i * 0.2),
//         bW = w * (1 - (i + 1) * 0.2);
//       const tOff = (w - tW) / 2,
//         bOff = (w - bW) / 2;
//       this.ctx.beginPath();
//       this.ctx.moveTo(x + tOff, y + i * sh);
//       this.ctx.lineTo(x + tOff + tW, y + i * sh);
//       this.ctx.lineTo(x + bOff + bW, y + (i + 1) * sh);
//       this.ctx.lineTo(x + bOff, y + (i + 1) * sh);
//       this.ctx.closePath();
//       this.setFill(this.colors[i % this.colors.length]);
//       this.ctx.fill();
//     }
//   }

//   // Card
//   private drawCard(x: number, y: number, w: number, h: number): void {
//     this.setFill('#fff');
//     this.ctx.fillRect(x, y, w, h);
//     this.setStroke('#000', 2);
//     this.ctx.strokeRect(x, y, w, h);
//     this.setFill('#2C3E50');
//     this.ctx.font = `${Math.min(w / 6, h / 3)}px Arial`;
//     this.ctx.textAlign = 'center';
//     this.ctx.fillText('123', x + w / 2, y + h / 2);
//   }

//   // Table
// private drawTableChart(x: number, y: number, w: number, h: number, color: string): void {
//     const rows = 4,
//       cols = 3;
//     const cellW = w / cols,
//       cellH = h / rows;

//     // Header row
//     this.ctx.fillStyle = color;
//     this.ctx.fillRect(x, y, w, cellH);

//     this.ctx.strokeStyle = '#000';
//     this.ctx.lineWidth = 2;

//     // Grid lines (both vertical and horizontal)
//     for (let i = 0; i <= cols; i++) {
//       const px = x + i * cellW;
//       this.ctx.beginPath();
//       this.ctx.moveTo(px, y);
//       this.ctx.lineTo(px, y + h);
//       this.ctx.stroke();
//     }
//     for (let i = 0; i <= rows; i++) {
//       const py = y + i * cellH;
//       this.ctx.beginPath();
//       this.ctx.moveTo(x, py);
//       this.ctx.lineTo(x + w, py);
//       this.ctx.stroke();
//     }
//   }

// private drawImageComponent(x: number, y: number, w: number, h: number): void {
//   const img = new Image();
//   img.src = 'assets/dashboard-great-design-any-site-600nw-1710898087.webp';

//   img.onload = () => {
//     this.ctx.clearRect(x, y, w, h);
//     this.ctx.drawImage(img, x, y, w, h); // Fit image inside the component
//     this.ctx.strokeStyle = '#000';
//     this.ctx.lineWidth = 2;
//     this.ctx.strokeRect(x, y, w, h); // Optional border
//   };

// //   img.onerror = () => {
// //     // Fallback design if image fails
// //     this.ctx.fillStyle = '#E74C3C';
// //     this.ctx.fillRect(x, y, w, h);
// //     this.ctx.fillStyle = '#FFF';
// //     this.ctx.font = `${Math.min(w, h) * 0.3}px Arial`;
// //     this.ctx.textAlign = 'center';
// //     this.ctx.textBaseline = 'middle';
// //     this.ctx.fillText('IMG', x + w / 2, y + h / 2);
// //   };
// }
// private drawFilterTextComponent(x: number, y: number, w: number, h: number, type: string, label?: string) {
//     this.ctx.fillStyle = '#fff';
//     this.ctx.fillRect(x, y, w, h);
//     this.ctx.strokeStyle = '#000';
//     this.ctx.strokeRect(x, y, w, h);
//     this.ctx.fillStyle = '#000';
//     this.ctx.font = `${Math.min(w, h) * 0.3}px Arial`;
//     this.ctx.textAlign = 'center';
//     this.ctx.textBaseline = 'middle';

//     if (type === 'dropdown') {
//       this.ctx.fillText(`${label || 'Select'} ▼`, x + w / 2, y + h / 2);
//     } else if (type === 'text') {
//       this.ctx.fillText( 'Search', x + w / 2, y + h / 2);
//     } else if (type === 'icon') {
//       this.ctx.fillText('⚙', x + w / 2, y + h / 2);
//     }
//   }
//   private drawMapComponent(x: number, y: number, w: number, h: number): void {
//   const img = new Image();
//   img.src = "assets/1000_F_1019790077_JTpsz2rNIXX4tHJvXZOSLF9aGn4XPp4k (1).jpg"; // ✅ Replace with your map image path

//   img.onload = () => {
//     this.ctx.drawImage(img, x, y, w, h);
//     this.ctx.strokeStyle = '#000';  // Optional border
//     this.ctx.strokeRect(x, y, w, h);
//   };

// //   img.onerror = () => {
// //     // Fallback if image not found
// //     this.ctx.fillStyle = '#EEE';
// //     this.ctx.fillRect(x, y, w, h);
// //     this.ctx.fillStyle = '#000';
// //     this.ctx.font = `${Math.min(w, h) * 0.15}px Arial`;
// //     this.ctx.textAlign = 'center';
// //     this.ctx.textBaseline = 'middle';
// //     this.ctx.fillText('Map Not Found', x + w / 2, y + h / 2);
// //   };
// }

//   public render(): void {
//   const { width: canvasW, height: canvasH } = this.canvas;
//   this.ctx.clearRect(0, 0, canvasW, canvasH);

//   // Background
//   this.ctx.fillStyle = "#F8F9FA";
//   this.ctx.fillRect(0, 0, canvasW, canvasH);

//   this.componentsData.forEach(({ x, y, width, height, component_type, series_type }) => {
//     const scaledX = x * this.scaleX, scaledY = y * this.scaleY;
//     const w = width * this.scaleX, h = height * this.scaleY;

//     switch (component_type.toLowerCase()) {
//       case "chart":
//         series_type?.forEach((series, i) => {
//           const color = this.colors[i % this.colors.length];
//           switch (series) {
//             case "LineSeries":
//             case "AreaSeries":
//               this.drawLineOrAreaChart(scaledX, scaledY, w, h, color, series === "AreaSeries");
//               break;
//             case "ColumnSeries":
//             case "ClusteredColumnSeries":
//             case "StackedColumnSeries":
//             case "Stacked100PercentColumnSeries":
//               this.drawBarChart(scaledX, scaledY, w, h);
//               break;
//             case "PieSeries":
//             case "DonutSeries":
//               this.drawPieOrDonutChart(scaledX, scaledY, w, h, series === "DonutSeries");
//               break;
//             case "WaterFallSeries":
//               this.drawWaterfallChart(scaledX, scaledY, w, h);
//               break;
//             case "TreeMapSeries":
//               this.drawTreemapChart(scaledX, scaledY, w, h);
//               break;
//             case "RadarLineSeries":
//             case "RadarAreaSeries":
//             case "RadarColumnSeries":
//               this.drawRadarChart(scaledX, scaledY, w, h, color);
//               break;
//             case "FunnelSeries":
//               this.drawFunnelChart(scaledX, scaledY, w, h);
//               break;
//             case "BubbleSeries":
//               this.drawBubbleChart(scaledX, scaledY, w, h);
//               break;
//             default:
//               console.warn(`Unknown chart series type: '${series}'`);
//           }
//         });
//         break;

//       case "grid":
//       case "pivot":
//         series_type?.forEach((el) => {
//           if (["TableRowSeries", "TableColumnSeries"].includes(el)) {
//             this.drawTableChart(scaledX, scaledY, w, h, this.colors[0]);
//           } else {
//             console.warn(`Unknown grid series type: '${el}'`);
//           }
//         });
//         break;

//       case "card":
//         series_type?.forEach((el) => {
//           if (el === "ValueSeries") this.drawCard(scaledX, scaledY, w, h);
//           else console.warn(`Unknown card series type: '${el}'`);
//         });
//         break;

//       case "image":
//         this.drawImageComponent(scaledX, scaledY, w, h );
//         break;
//        case 'filter':
//        case 'text': {
//       // If your IComponent interface contains filterType and filterLabel, extract them here.
//        // Otherwise, set default values.
//        const type = (component_type === 'text') ? 'text' : 'dropdown';
//        const label = undefined; // Replace with actual label if available in your data
//        this.drawFilterTextComponent(scaledX, scaledY, w, h, type, label);
//        break;
//        }
//        case 'spatialmap':
// 	   case 'geomap':
// 			series_type?.forEach((el) => {
// 		 if (["SpatialPolygonSeries", "HeatMapSeries"].includes(el)) {
// 		   this.drawMapComponent(scaledX, scaledY, w, h);
// 		 }
// 		});
// 		break;
//       default:
//         console.warn(`Unknown component type: '${component_type}'`);
//         break;
    
//     }
//   });
// }

// public destroy(): void {
//   window.removeEventListener("resize", this.handleResize);
//   if (this.canvas?.parentElement) {
//     this.canvas.parentElement.removeChild(this.canvas);
//   }
// }

// private colors = [
//     '#005DA6', '#be952cff', '#BAE1FF', '#75C2FF', '#30A4FF',
//     '#00467D', '#CBC53E', '#089AD7', '#6D6E71', '#D0CECE',
//     '#DE354C', '#932432', '#3C1874', '#283747', '#DDAF94'
//   ];
// private colors = [ '#F8BBD0', // pink
//   '#FCE38A', // pastel yellow
//   '#B5EAD7', // mint green
//   '#C7CEEA', // light lavender
//   '#B4F8C8', // seafoam
//   '#FFD3B6', // peach
//   '#E0BBE4', // lavender
//     ];

private colors = ['#FFADAD', '#FFD6A5','#FDFFB6', '#CAFFBF',
   '#9BFBCF', '#A0C4FF', '#BDB2FF', '#FFC6FF',];
private cornerRadius = 5;       // Corner radius
private borderWidth = 1;        // Border thickness

// Function to draw rounded rectangle
private drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
  // ---------- UTILITIES ----------
  private getRandomData(count: number, min = 40, max = 170): number[] {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min) + min + 10));
  }
  private setStroke(color: string, width = 2) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
  }
  private setFill(color: string) {
    this.ctx.fillStyle = color;
  }


  // ---------- DRAW METHODS ----------
  // private drawLineOrAreaChart(x: number, y: number, w: number, h: number, color: string, isArea: boolean): void {
  //   const points = 7, stepX = w / (points - 1);
  //   // Use fixed values for more consistent chart shapes
  //   const areaValues = [30, 30, 80, 50, 50, 80, 30]; 
  //   const lineValues = [90, 80, 65, 40, 25, 10, 5];
  //   const values = isArea ? areaValues : lineValues;
  //   const maxVal = Math.max(...values);

  //   // Calculate coordinates for both line and points
  //   const coords = values.map((val, i) => ({
  //     x: x + i * stepX,
  //     y: y + h - (h * val) / maxVal
  //   }));

  //   this.ctx.save();
  //   this.ctx.beginPath();
  //   this.ctx.moveTo(coords[0].x, coords[0].y);
  //   // Use bezier curves for smooth area/line
  //   for (let i = 1; i < coords.length; i++) {
  //     const prev = coords[i - 1];
  //     const curr = coords[i];
  //     const midX = (prev.x + curr.x) / 2;
  //     this.ctx.quadraticCurveTo(prev.x, prev.y, midX, (prev.y + curr.y) / 2);
  //   }
  //   this.ctx.lineTo(coords.at(-1)!.x, coords.at(-1)!.y);

  //   if (isArea) {
  //     // Close area to bottom
  //     this.ctx.lineTo(coords.at(-1)!.x, y + h);
  //     this.ctx.lineTo(coords[0].x, y + h);
  //     this.ctx.closePath();
  //     // Pastel fill and thin border
  //     this.ctx.fillStyle = this.colors[7];
  //     this.ctx.fill();
  //     this.ctx.strokeStyle = this.colors[7] + '40';
  //     this.ctx.lineWidth = 2;
  //     this.ctx.stroke();
  //   } else {
  //     // Line chart: just stroke
  //     this.ctx.strokeStyle = this.colors[0];
  //     this.ctx.lineWidth = 2;
  //     this.ctx.stroke();

  //     // Draw points for line chart only, centered on the line
  //     for (const pt of coords) {
  //       this.ctx.beginPath();
  //       this.ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
  //       this.ctx.fillStyle = this.colors[0];
  //       this.ctx.fill();
  //       this.ctx.strokeStyle = this.colors[0] + '40'; // Lighter stroke for points
  //       this.ctx.lineWidth = 2;
  //       this.ctx.stroke();
  //     }
  //   }
  //   this.ctx.restore();
  // }

  private drawLineOrAreaChart(
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  color: string, 
  mode: 'area' | 'line' | 'clusterarea' | 'clusterline'
): void {
  
  const points = 7;
  const stepX = w / (points - 1);

  // Base data sets
  const areaValues = [30, 30, 80, 50, 50, 80, 30];
  const lineValues = [90, 80, 65, 40, 25, 10, 5];

  // For clusters: add a second set
  const clusterOffset = 10; // small offset for cluster separation
  const clusterValues = [50, 60, 75, 45, 35, 20, 15];

  // Decide which main values to draw
  const isArea = mode === 'area' || mode === 'clusterarea';
  const values = isArea ? areaValues : lineValues;
  const maxVal = Math.max(...values);

  // Convert values to coordinates
  const coords = values.map((val, i) => ({
    x: x + i * stepX,
    y: y + h - (h * val) / maxVal
  }));

  // Draw main chart
  this.ctx.save();
  this.ctx.beginPath();
  this.ctx.moveTo(coords[0].x, coords[0].y);
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const midX = (prev.x + curr.x) / 2;
    this.ctx.quadraticCurveTo(prev.x, prev.y, midX, (prev.y + curr.y) / 2);
  }

  if (isArea) {
    this.ctx.lineTo(coords.at(-1)!.x, y + h);
    this.ctx.lineTo(coords[0].x, y + h);
    this.ctx.closePath();
    this.ctx.fillStyle = color + '80'; // semi-transparent fill
    this.ctx.fill();
  }

  this.ctx.strokeStyle = color;
  this.ctx.lineWidth = 2;
  this.ctx.stroke();

  // Points on line chart
  if (!isArea) {
    for (const pt of coords) {
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }
  }

  // Handle clusters (draw second series)
  if (mode === 'clusterline' || mode === 'clusterarea') {
    const maxClusterVal = Math.max(...clusterValues);
    const clusterCoords = clusterValues.map((val, i) => ({
      x: x + i * stepX,
      y: y + h - (h * val) / maxClusterVal - clusterOffset
    }));

    this.ctx.beginPath();
    this.ctx.moveTo(clusterCoords[0].x, clusterCoords[0].y);
    for (let i = 1; i < clusterCoords.length; i++) {
      const prev = clusterCoords[i - 1];
      const curr = clusterCoords[i];
      const midX = (prev.x + curr.x) / 2;
      this.ctx.quadraticCurveTo(prev.x, prev.y, midX, (prev.y + curr.y) / 2);
    }

    if (mode === 'clusterarea') {
      this.ctx.lineTo(clusterCoords.at(-1)!.x, y + h);
      this.ctx.lineTo(clusterCoords[0].x, y + h);
      this.ctx.closePath();
      this.ctx.fillStyle = '#ff980080'; // another semi-transparent color
      this.ctx.fill();
    }

    this.ctx.strokeStyle = '#ff9800';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  this.ctx.restore();
}

  private drawTreemapChart(x: number, y: number, w: number, h: number): void {
    // const areas = [0.4, 0.4, 0.25, 1, 0.3, 0.2, 0.15,3];
    const areas = [0.4, 0.4, 0.25, 1, 0.3, 0.2, 0.15, 3];

    let curX = x, curY = y, remW = w, remH = h;
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#fff';
    areas.forEach((a, i) => {
      const isHorizontal = i % 2 === 0;
      const rectW = isHorizontal ? remW * a : remW;
      const rectH = isHorizontal ? remH : remH * a;
      this.ctx.fillStyle = this.colors[i % this.colors.length];
      this.ctx.fillRect(curX, curY, rectW, rectH);
      this.ctx.strokeRect(curX, curY, rectW, rectH);
      if (isHorizontal) {
        curX += rectW;
        remW -= rectW;
      } else {
        curY += rectH;
        remH -= rectH;
      }
    });
  }

  // private drawPieOrDonutChart(x: number, y: number, w: number, h: number, isDonut: boolean): void {
  //   const data = this.getRandomData(6),
  //     total = data.reduce((a, b) => a + b, 0);
  //   const R = Math.min(w, h) / 2,
  //     r = isDonut ? R / 2 : 0,
  //     cx = x + w / 2,
  //     cy = y + h / 2;
  //   let angle = 0;
  //   data.forEach((val, i) => {
  //     const slice = (val / total) * Math.PI * 2;
  //     this.ctx.beginPath();
  //     this.ctx.arc(cx, cy, R, angle, angle + slice);
  //     isDonut
  //       ? this.ctx.arc(cx, cy, r, angle + slice, angle, true)
  //       : this.ctx.lineTo(cx, cy);
  //     this.ctx.closePath();
  //     this.setFill(this.colors[i % this.colors.length]);
  //     this.ctx.fill();
  //     angle += slice;
  //   });
  // }
  private drawPieOrDonutChart(
  x: number,
  y: number,
  w: number,
  h: number,
  isDonut: boolean
): void {
  // const data = this.getRandomData(6);
   const data = [30,30,30,30,30,30];
  const total = data.reduce((a, b) => a + b, 0);

  const R = Math.min(w, h) / 2;
  const r = isDonut ? R / 2 : 0;
  const cx = x + w / 2;
  const cy = y + h / 2;

  let angle = 0;

  data.forEach((val, i) => {
    const slice = (val / total) * Math.PI * 2;

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, angle, angle + slice);

    if (isDonut) {
      this.ctx.arc(cx, cy, r, angle + slice, angle, true);
    } else {
      this.ctx.lineTo(cx, cy);
    }

    this.ctx.closePath();
    this.ctx.fillStyle = this.colors[i % this.colors.length];
    this.ctx.fill();

    // White border for separation
    this.ctx.lineWidth = 1; // Thickness of gap
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.stroke();

    angle += slice;
  });
}

private drawColumnBarChart(
  x: number,
  y: number,
  w: number,
  h: number,
  type: "column" | "bar" | "cluster" | "stacked-column" | "stacked-row"
): void {
  const data = this.getRandomData(6);
  const chartHeight = h - 20;
  const chartWidth = w - 20;
  const maxVal = Math.max(...data);
  const gap = 10;
  const ctx = this.ctx;

  // For stacked-column (vertical split)
  const drawHalfStackVertical = (bx: number, by: number, barWidth: number, barHeight: number) => {
    const half = barHeight / 2;
    this.drawBar(ctx, bx, by, barWidth, half, this.colors[1]);
    this.drawBar(ctx, bx, by + half, barWidth, half, this.colors[2]);
  };

  // For stacked-row (horizontal split)
  const drawHalfStackHorizontal = (bx: number, by: number, barWidth: number, barHeight: number) => {
    const half = barWidth / 2;
    this.drawBar(ctx, bx, by, half, barHeight, this.colors[1]);
    this.drawBar(ctx, bx + half, by, half, barHeight, this.colors[2]);
  };

  data.forEach((val, i) => {
    let bx: number, by: number, barWidth: number, barHeight: number;

    if (type === "column" || type === "stacked-column" || type === "cluster") {
      barWidth = type === "cluster"
        ? (chartWidth / data.length - gap) / 2
        : chartWidth / data.length - gap;
      barHeight = (val / maxVal) * chartHeight;
      bx = x + gap + i * ((type === "cluster" ? barWidth * 2 : barWidth));
      by = y + chartHeight - barHeight;
    } else {
      barHeight = chartHeight / data.length - gap;
      barWidth = (val / maxVal) * chartWidth;
      bx = x + gap;
      by = y + i * (barHeight + gap);
    }

    switch (type) {
      case "column":
        this.drawBar(ctx, bx, by, barWidth, barHeight, this.colors[0]);
        break;
      case "stacked-column":
        drawHalfStackVertical(bx, by, barWidth, barHeight);
        break;
      case "cluster":
        this.drawBar(ctx, bx, by, barWidth, barHeight, this.colors[4]);
        this.drawBar(ctx, bx + barWidth, by, barWidth, barHeight, this.colors[5]);
        break;
      case "bar":
        this.drawBar(ctx, bx, by, barWidth, barHeight, this.colors[6]);
        break;
      case "stacked-row":
        drawHalfStackHorizontal(bx, by, barWidth, barHeight);
        break;
    }
  });
}


private drawBar(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  barWidth: number,
  barHeight: number,
  color: string
): void {
  this.drawRoundedRect(ctx, bx, by, barWidth, barHeight, this.cornerRadius);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = this.borderWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

 private drawBarChart(x: number, y: number, w: number, h: number): void {
    const bars = 6, barW = w / bars;
    for (let i = 0; i < bars; i++) {
      const bh = Math.random() * (h * 0.8) * 0.8;
      this.setFill(this.colors[i % this.colors.length]);
      this.ctx.fillRect(x + i * barW, y + h - bh, barW - 2, bh);
    }
  }

private drawBubbleChart(x: number, y: number, w: number, h: number): void {
  const bubbles = 8;
  // Define fixed bubble positions and radii once, outside the loop
  
const fixedBubbles = [
  { bx: x + w * 0.3,  by: y + h * 0.1, radius: Math.min(w, h) * 0.10 }, // biggest
  { bx: x + w * 0.4,  by: y + h * 0.25, radius: Math.min(w, h) * 0.08 },
  { bx: x + w * 0.5,  by: y + h * 0.4, radius: Math.min(w, h) * 0.07 },
  { bx: x + w * 0.6,  by: y + h * 0.55, radius: Math.min(w, h) * 0.06 },
  { bx: x + w * 0.7,  by: y + h * 0.7, radius: Math.min(w, h) * 0.05 },
  { bx: x + w * 0.8,  by: y + h * 0.85, radius: Math.min(w, h) * 0.04 }  // smallest
];


// Sort by radius in descending order

  for (let i = 0; i < bubbles && i < fixedBubbles.length; i++) {
    const { bx, by, radius } = fixedBubbles[i];
    this.setFill(this.colors[6] ); // Assuming '80' is for 50% opacity (e.g., rgba)
    this.ctx.beginPath();
    this.ctx.arc(bx, by, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.setStroke('#BDB2FF'+ '40', 1); // Lighter stroke for points
    this.ctx.stroke();
  }
}

  // private drawWaterfallChart(x: number, y: number, w: number, h: number): void {
  //   const bars = 5, barW = w / bars + 6;
  //   let currentHeight = h * 0.3;
  //   for (let i = 0; i < bars; i++) {
  //     const change = h * 0.1, bh = Math.abs(change) + 3;
  //     const barX = x + i * barW + 2;
  //     const barY = i === 0 ? y + h - currentHeight : y + h - currentHeight - bh;
  //     this.setFill(this.colors[i % this.colors.length]);
  //     this.ctx.fillRect(barX, barY, barW - 4, bh);
  //     currentHeight += change + 1;
  //   }
  // }
private drawWaterfallChart(x: number, y: number, w: number, h: number): void {
  const bars = 6;
  const gap = 10;
  const barW = (w - (bars + 1) * gap) / bars;

  // Clamp barW to minimum 1 to avoid negative/overflow
  const safeBarW = Math.max(barW, 1);

  let currentY = y + h;
  // const barColor = "#ff6384";

  // Calculate total bar heights to avoid overflow
  const maxBarH = h / bars;
  for (let i = 0; i < bars; i++) {
    // Use fixed or clamped height to avoid overflow
    // Use fixed bar heights for a consistent waterfall shape
    const fixedHeights = [maxBarH * 1.2, maxBarH, maxBarH * 0.8, maxBarH * 0.6, maxBarH * 0.8, maxBarH];
    const barH = Math.min(fixedHeights[i % fixedHeights.length], currentY - y);

    currentY -= barH;
    const barX = x + gap + i * (safeBarW + gap);
    const barY = currentY;

    // Prevent drawing outside the top boundary
    if (barY < y) break;

    this.ctx.fillStyle = this.colors[0];
    this.drawRoundedRect(this.ctx, barX, barY, safeBarW, barH, 6);
    this.ctx.fill();
  }
}


private drawScatterChart(
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
): void {
  // Draw background box
  this.ctx.fillStyle = '#fff';
  this.ctx.fillRect(x, y, w, h);

  // Random dots
  for (let i = 0; i < 100; i++) {
    const px = x + Math.random() * w;
    const py = y + Math.random() * h;

    this.ctx.beginPath();
    this.ctx.arc(px, py, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = this.colors[6];;
    this.ctx.fill();
  }
}
  /**
   * Draws a radar chart in either "area" or "line" mode.
   * - "area": draws a filled polygon with points and a border (shows background under semi-transparent area).
   * - "line": draws only the polygon outline and points (background fully visible).
   */
  // private drawRadarChart(
  //   x: number,
  //   y: number,
  //   w: number,
  //   h: number,
  //   color: string,
  //   mode: "area" | "line" 
  // ): void {
  //   const cx = x + w / 2;
  //   const cy = y + h / 2;
  //   const R = Math.min(w, h) / 2 - 5;
  //   const axes = 7;

  //   // Generate fixed values for consistent shape
  //   const values = [0.7, 0.9, 0.6, 0.8, 0.5, 0.85, 0.65];
  //   const points: { x: number, y: number }[] = [];
  //   for (let i = 0; i < axes; i++) {
  //     const angle = (i / axes) * 2 * Math.PI - Math.PI / 2;
  //     const val = values[i % values.length];
  //     points.push({
  //       x: cx + Math.cos(angle) * R * val,
  //       y: cy + Math.sin(angle) * R * val
  //     });
  //   }

  //   // Draw radar polygon
  //   this.ctx.beginPath();
  //   points.forEach((pt, i) => {
  //     if (i === 0) this.ctx.moveTo(pt.x, pt.y);
  //     else this.ctx.lineTo(pt.x, pt.y);
  //   });
  //   this.ctx.closePath();

  //   if (mode === "area") {
  //     // Fill with semi-transparent color, then stroke
  //     this.setFill(this.colors[6] + "40"); // Semi-transparent fill
  //     this.ctx.fill();
  //     this.setStroke(this.colors[6] );
  //     this.ctx.stroke();
  //   } else if (mode === "line") {
  //     // Only stroke (no fill)

  //     this.setStroke(this.colors[6], 2);
  //     this.ctx.stroke();
  //   }

  //   // Draw points
  //   for (const pt of points) {
  //     this.ctx.beginPath();
  //     this.ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
  //     this.ctx.fillStyle = this.colors[6];
  //     this.ctx.fill();
  //     this.ctx.strokeStyle = (mode === "area") ? this.colors[6] + "40" : this.colors[6];
  //     this.ctx.lineWidth = 4;
  //     this.ctx.stroke();
  //   }
  // }
  // private drawFunnelChart(x: number, y: number, w: number, h: number): void {
  //   const stages = 4, sh = h / stages;
  //   for (let i = 0; i < stages; i++) {
  //     const tW = w * (1 - i * 0.2), bW = w * (1 - (i + 1) * 0.2);
  //     const tOff = (w - tW) / 2, bOff = (w - bW) / 2;
  //     this.ctx.beginPath();
  //     this.ctx.moveTo(x + tOff, y + i * sh);
  //     this.ctx.lineTo(x + tOff + tW, y + i * sh);
  //     this.ctx.lineTo(x + bOff + bW, y + (i + 1) * sh);
  //     this.ctx.lineTo(x + bOff, y + (i + 1) * sh);
  //     this.ctx.closePath();
  //     this.setFill(this.colors[i % this.colors.length]);
  //     this.ctx.fill();
  //   }
  // }

  private drawRadarChart(
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  mode: "area" | "line" | "clusterline" | "clusterarea"
): void {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const R = Math.min(w, h) / 2 - 5;
  const axes = 7;

  // Multiple datasets for cluster modes
  const datasets = mode.startsWith('cluster') 
    ? [
        [0.7, 0.9, 0.6, 0.8, 0.5, 0.85, 0.65], // first
        [0.6, 0.8, 0.7, 0.75, 0.55, 0.9, 0.6]  // second
      ]
    : [[0.7, 0.9, 0.6, 0.8, 0.5, 0.85, 0.65]];

  datasets.forEach((values, idx) => {
    const points: { x: number, y: number }[] = [];

    for (let i = 0; i < axes; i++) {
      const angle = (i / axes) * 2 * Math.PI - Math.PI / 2;
      const val = values[i % values.length];
      points.push({
        x: cx + Math.cos(angle) * R * val,
        y: cy + Math.sin(angle) * R * val
      });
    }

    // Draw radar polygon
    this.ctx.beginPath();
    points.forEach((pt, i) => {
      if (i === 0) this.ctx.moveTo(pt.x, pt.y);
      else this.ctx.lineTo(pt.x, pt.y);
    });
    this.ctx.closePath();

    const currentColor = this.colors[(6 + idx) % this.colors.length];

    if (mode.endsWith("area")) {
      this.setFill(currentColor + "40"); // transparent fill
      this.ctx.fill();
      this.setStroke(currentColor);
      this.ctx.stroke();
    } else {
      this.setStroke(currentColor, 2);
      this.ctx.stroke();
    }

    // Draw points
    for (const pt of points) {
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
      this.ctx.fillStyle = currentColor;
      this.ctx.fill();
      this.ctx.strokeStyle = currentColor;
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
    }
  });
}

 
private drawFunnelChart(x: number, y: number, w: number, h: number): void {
  const stages = 6;
  const sh = h / stages;

  for (let i = 0; i < stages; i++) {
    const rectW = w * (1 - i * 0.15); // Gradually decrease width
    const rectX = x + (w - rectW) / 2;
    const rectY = y + i * sh;

    // Draw rounded rectangle for each stage
    this.drawRoundedRect(this.ctx, rectX, rectY, rectW, sh - 2, this.cornerRadius);
    this.ctx.fillStyle = this.colors[i % this.colors.length];
    this.ctx.fill();

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.colors[i % this.colors.length];
    this.ctx.stroke();
  }
}


  private drawCard(x: number, y: number, w: number, h: number): void {
    this.setFill('#fff');
    this.ctx.fillRect(x, y, w, h);
    this.setStroke('#000', 2);
    this.ctx.strokeRect(x, y, w, h);
    this.setFill('#2C3E50');
    this.ctx.font = `${Math.min(w / 6, h / 3)}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText('123', x + w / 2, y + h / 2);
  }

  private drawTableChart(x: number, y: number, w: number, h: number, color: string): void {
    const rows = 4, cols = 3;
    const cellW = w / cols, cellH = h / rows;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, cellH);
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    for (let i = 0; i <= cols; i++) {
      const px = x + i * cellW;
      this.ctx.beginPath();
      this.ctx.moveTo(px, y);
      this.ctx.lineTo(px, y + h);
      this.ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
      const py = y + i * cellH;
      this.ctx.beginPath();
      this.ctx.moveTo(x, py);
      this.ctx.lineTo(x + w, py);
      this.ctx.stroke();
    }
  }

  private drawImageComponent(x: number, y: number, w: number, h: number): void {
    const img = new Image();
    img.src = 'assets/dashboard-great-design-any-site-600nw-1710898087.webp';
    img.onload = () => {
      this.ctx.clearRect(x, y, w, h);
      this.ctx.drawImage(img, x, y, w, h);
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, w, h);
    };
  }

  private drawFilterTextComponent(x: number, y: number, w: number, h: number, type: string, label?: string) {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeStyle = '#000';
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.fillStyle = '#000';
    this.ctx.font = `${Math.min(w, h) * 0.3}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    if (type === 'dropdown') {
      this.ctx.fillText(`${label || 'Select'} ▼`, x + w / 2, y + h / 2);
    } else if (type === 'text') {
      this.ctx.fillText('Search', x + w / 2, y + h / 2);
    } else if (type === 'icon') {
      this.ctx.fillText('⚙', x + w / 2, y + h / 2);
    }
  }

  private drawMapComponent(x: number, y: number, w: number, h: number): void {
    const img = new Image();
    img.src = 'assets/1000_F_1019790077_JTpsz2rNIXX4tHJvXZOSLF9aGn4XPp4k (1).jpg'; // Replace with your map image path
    img.onload = () => {
      this.ctx.drawImage(img, x, y, w, h);
      this.ctx.strokeStyle = '#000';
      this.ctx.strokeRect(x, y, w, h);
    };
  }
// ✅ Chart Series Renderer Mapping
private chartRenderers: Record<string, (x: number, y: number, w: number, h: number, color: string) => void> = {
  LineSeries: (x, y, w, h, color) => this.drawLineOrAreaChart(x, y, w, h, color, 'line'),
 AreaSeries: (x, y, w, h, color) => this.drawLineOrAreaChart(x, y, w, h, color, 'area'),
 ClusterLineSeries: (x, y, w, h, color) => this.drawLineOrAreaChart(x, y, w, h, color, 'clusterline'),
 ClusterAreaSeries: (x, y, w, h, color) => this.drawLineOrAreaChart(x, y, w, h, color, 'clusterarea'),

  ColumnSeries: (x, y, w, h, color) => this.drawColumnBarChart(x, y, w, h, "column"),
  ClusterBarSeries: (x, y, w, h, color) => this.drawColumnBarChart(x, y, w, h, "cluster"),
  BarSeries: (x, y, w, h, color) => this.drawColumnBarChart(x, y, w, h, "bar"),
  StackedBarSeries: (x, y, w, h, color) => this.drawColumnBarChart(x, y, w, h, "stacked-row"),
  StackedColumnSeries: (x, y, w, h, color) => this.drawColumnBarChart(x, y, w, h, "stacked-column"),
  ClusteredColumnSeries: (x, y, w, h) => this.drawBarChart(x, y, w, h),
  PieSeries: (x, y, w, h) => this.drawPieOrDonutChart(x, y, w, h, false),
  ScatterSeries: (x, y, w, h) => this.drawScatterChart(x, y, w, h, this.colors[0]),
  DonutSeries: (x, y, w, h) => this.drawPieOrDonutChart(x, y, w, h, true),
  WaterFallSeries: (x, y, w, h) => this.drawWaterfallChart(x, y, w, h),
  TreeMapSeries: (x, y, w, h) => this.drawTreemapChart(x, y, w, h),
 RadarLine: (x, y, w, h, color) => this.drawRadarChart(x, y, w, h, color, 'line'),
RadarArea: (x, y, w, h, color) => this.drawRadarChart(x, y, w, h, color, 'area'),
ClusterLineRadar: (x, y, w, h, color) => this.drawRadarChart(x, y, w, h, color, 'clusterline'),
ClusterAreaRadar: (x, y, w, h, color) => this.drawRadarChart(x, y, w, h, color, 'clusterarea'),

  FunnelSeries: (x, y, w, h) => this.drawFunnelChart(x, y, w, h),
  BubbleSeries: (x, y, w, h) => this.drawBubbleChart(x, y, w, h),
};
 

// ✅ Common Handlers (DRY)
private handleChartRender = (x: number, y: number, w: number, h: number, comp: IComponent) => {
  comp.series_type?.forEach((series, i) => {
    const renderer = this.chartRenderers[series];
    if (renderer) renderer(x, y, w, h, this.colors[i % this.colors.length]);
    else console.warn(`Unknown chart series type: ${series}`);
  });
};

private handleGridRender = (x: number, y: number, w: number, h: number, comp: IComponent) => {
  comp.series_type.forEach(series => {
    if (["TableRowSeries", "TableColumnSeries"].includes(series)) {
      this.drawTableChart(x, y, w, h, this.colors[0]);
    } else {
      console.warn(`Unknown grid series type: ${series}`);
    }
  });
};

private handlePivotRender = (x: number, y: number, w: number, h: number, comp: IComponent) => {
  comp.series_type?.forEach(series => {
    if (["PivotRowSeries", "PivotColumnSeries"].includes(series)) {
      this.drawTableChart(x, y, w, h, this.colors[1]);
    } else {
      console.warn(`Unknown pivot series type: ${series}`);
    }
  });
};

private handleCardRender = (x: number, y: number, w: number, h: number, comp: IComponent) => {
  comp.series_type.forEach(series => {
    if (series === "ValueSeries") {
      this.drawCard(x, y, w, h);
    } else {
      console.warn(`Unknown card series type: ${series}`);
    }
  });
};

private handleFilterRender = (x: number, y: number, w: number, h: number, comp: IComponent) => {
  comp.series_type.forEach(series => {
    if (series === "DropdownSeries") {
      this.drawFilterTextComponent(x, y, w, h, 'dropdown', 'Select');
    } else if (series === "IconSeries") {
      this.drawFilterTextComponent(x, y, w, h, 'icon', '');
    } else {
      console.warn(`Unknown filter series type: ${series}`);
    }
  });
};

private handleTextRender = (x: number, y: number, w: number, h: number, comp: IComponent) => {
  comp.series_type.forEach(series => {
    if (series === "TextSeries") {
      this.drawFilterTextComponent(x, y, w, h, 'text', 'Search');
    } else {
      console.warn(`Unknown text series type: ${series}`);
    }
  });
};

private handleMapRender = (x: number, y: number, w: number, h: number, comp: IComponent) => {
  const allowedSeries = [
    "SpatialPolygonSeries", "HeatMapSeries",
    "GeoMapSeries", "ChoroplethSeries"
  ];

  comp.series_type.forEach(series => {
    if (allowedSeries.includes(series)) {
      this.drawMapComponent(x, y, w, h);
    } else {
      console.warn(`Unknown map series type: ${series}`);
    }
  });
};

// ✅ Dispatcher for Components
private componentRenderers: Record<string, (x: number, y: number, w: number, h: number, comp: IComponent) => void> = {
  chart: this.handleChartRender,
  grid: this.handleGridRender,
  pivot: this.handleGridRender,
  card: this.handleCardRender,
  image: (x, y, w, h) => this.drawImageComponent(x, y, w, h),
  filter: this.handleFilterRender,
  text: this.handleTextRender,
  spatialmap: this.handleMapRender,
  geomap: this.handleMapRender
};

// ✅ Render Method
public render(): void {
  const { width: canvasW, height: canvasH } = this.canvas;
  this.ctx.clearRect(0, 0, canvasW , canvasH );

  // Background
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, canvasW , canvasH );

  this.componentsData.forEach(comp => {
    const { x, y, width, height, component_type } = comp;
    const scaledX = x * this.scaleX, scaledY = y * this.scaleY;
    const w = width * this.scaleX, h = height * this.scaleY;

    const renderer = this.componentRenderers[component_type.toLowerCase()];
    if (renderer) {
      renderer(scaledX, scaledY, w, h, comp);
    } else {
      console.warn(`Unknown component type: ${component_type}`);
    }
  });
}

public destroy(): void {
  window.removeEventListener('resize', this.handleResize);
  if (this.canvas?.parentElement) {
    this.canvas.parentElement.removeChild(this.canvas);
  }
}
}
