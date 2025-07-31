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
    this.scaleX = this.elementRef.nativeElement.clientWidth / maxX;
    this.scaleY = this.elementRef.nativeElement.clientHeight / maxY;
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

private colors = [
    '#005DA6', '#FFC52F', '#BAE1FF', '#75C2FF', '#30A4FF',
    '#00467D', '#CBC53E', '#089AD7', '#6D6E71', '#D0CECE',
    '#DE354C', '#932432', '#3C1874', '#283747', '#DDAF94'
  ];

 

  // ---------- UTILITIES ----------
  private getRandomData(count: number, min = 10, max = 100): number[] {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min) + min));
  }
  private setStroke(color: string, width = 2) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
  }
  private setFill(color: string) {
    this.ctx.fillStyle = color;
  }

  // ---------- DRAW METHODS ----------
  private drawLineOrAreaChart(x: number, y: number, w: number, h: number, color: string, isArea: boolean): void {
    const points = 8, stepX = w / (points - 1);
    const coords = Array.from({ length: points }, (_, i) => ({
      x: x + i * stepX,
      y: y + Math.random() * h,
    }));
    this.ctx.beginPath();
    this.setStroke(color);
    this.ctx.moveTo(coords[0].x, coords[0].y);
    coords.forEach((p, i) => i && this.ctx.lineTo(p.x, p.y));
    if (isArea) {
      this.ctx.lineTo(coords.at(-1)!.x, y + h);
      this.ctx.lineTo(coords[0].x, y + h);
      this.ctx.closePath();
      this.setFill(color + '40');
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  private drawTreemapChart(x: number, y: number, w: number, h: number): void {
    const areas = [0.4, 0.4, 0.25, 1];
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

  private drawPieOrDonutChart(x: number, y: number, w: number, h: number, isDonut: boolean): void {
    const data = this.getRandomData(6),
      total = data.reduce((a, b) => a + b, 0);
    const R = Math.min(w, h) / 2,
      r = isDonut ? R / 2 : 0,
      cx = x + w / 2,
      cy = y + h / 2;
    let angle = 0;
    data.forEach((val, i) => {
      const slice = (val / total) * Math.PI * 2;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, R, angle, angle + slice);
      isDonut
        ? this.ctx.arc(cx, cy, r, angle + slice, angle, true)
        : this.ctx.lineTo(cx, cy);
      this.ctx.closePath();
      this.setFill(this.colors[i % this.colors.length]);
      this.ctx.fill();
      angle += slice;
    });
  }

  private drawBarChart(x: number, y: number, w: number, h: number): void {
    const bars = 6, barW = w / bars;
    for (let i = 0; i < bars; i++) {
      const bh = Math.random() * (h * 0.8);
      this.setFill(this.colors[i % this.colors.length]);
      this.ctx.fillRect(x + i * barW, y + h - bh, barW - 2, bh);
    }
  }

  private drawBubbleChart(x: number, y: number, w: number, h: number): void {
    const bubbles = 8;
    for (let i = 0; i < bubbles; i++) {
      const bx = x + Math.random() * w,
        by = y + Math.random() * h;
      const radius = Math.random() * (Math.min(w, h) * 0.15) + 3;
      this.setFill(this.colors[i % this.colors.length] + '80');
      this.ctx.beginPath();
      this.ctx.arc(bx, by, radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.setStroke(this.colors[i % this.colors.length], 1);
      this.ctx.stroke();
    }
  }

  private drawWaterfallChart(x: number, y: number, w: number, h: number): void {
    const bars = 5, barW = w / bars + 6;
    let currentHeight = h * 0.3;
    for (let i = 0; i < bars; i++) {
      const change = h * 0.1, bh = Math.abs(change) + 3;
      const barX = x + i * barW + 2;
      const barY = i === 0 ? y + h - currentHeight : y + h - currentHeight - bh;
      this.setFill(this.colors[i % this.colors.length]);
      this.ctx.fillRect(barX, barY, barW - 4, bh);
      currentHeight += change + 1;
    }
  }

  private drawRadarChart(x: number, y: number, w: number, h: number, color: string): void {
    const cx = x + w / 2, cy = y + h / 2, R = Math.min(w, h) / 2 - 5, axes = 6;
    this.setStroke('#ddd');
    for (let i = 0; i < axes; i++) {
      const angle = (i / axes) * 2 * Math.PI - Math.PI / 2;
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      this.ctx.stroke();
    }
    this.ctx.beginPath();
    this.setFill(color + '40');
    this.setStroke(color);
    for (let i = 0; i < axes; i++) {
      const angle = (i / axes) * 2 * Math.PI - Math.PI / 2;
      const val = Math.random() * 0.8 + 0.2;
      const px = cx + Math.cos(angle) * R * val,
        py = cy + Math.sin(angle) * R * val;
      i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  private drawFunnelChart(x: number, y: number, w: number, h: number): void {
    const stages = 4, sh = h / stages;
    for (let i = 0; i < stages; i++) {
      const tW = w * (1 - i * 0.2), bW = w * (1 - (i + 1) * 0.2);
      const tOff = (w - tW) / 2, bOff = (w - bW) / 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x + tOff, y + i * sh);
      this.ctx.lineTo(x + tOff + tW, y + i * sh);
      this.ctx.lineTo(x + bOff + bW, y + (i + 1) * sh);
      this.ctx.lineTo(x + bOff, y + (i + 1) * sh);
      this.ctx.closePath();
      this.setFill(this.colors[i % this.colors.length]);
      this.ctx.fill();
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
  LineSeries: (x, y, w, h, color) => this.drawLineOrAreaChart(x, y, w, h, color, false),
  AreaSeries: (x, y, w, h, color) => this.drawLineOrAreaChart(x, y, w, h, color, true),
  ColumnSeries: (x, y, w, h) => this.drawBarChart(x, y, w, h),
  ClusteredColumnSeries: (x, y, w, h) => this.drawBarChart(x, y, w, h),
  StackedColumnSeries: (x, y, w, h) => this.drawBarChart(x, y, w, h),
  Stacked100PercentColumnSeries: (x, y, w, h) => this.drawBarChart(x, y, w, h),
  PieSeries: (x, y, w, h) => this.drawPieOrDonutChart(x, y, w, h, false),
  DonutSeries: (x, y, w, h) => this.drawPieOrDonutChart(x, y, w, h, true),
  WaterFallSeries: (x, y, w, h) => this.drawWaterfallChart(x, y, w, h),
  TreeMapSeries: (x, y, w, h) => this.drawTreemapChart(x, y, w, h),
  RadarLineSeries: (x, y, w, h, color) => this.drawRadarChart(x, y, w, h, color),
  RadarAreaSeries: (x, y, w, h, color) => this.drawRadarChart(x, y, w, h, color),
  RadarColumnSeries: (x, y, w, h, color) => this.drawRadarChart(x, y, w, h, color),
  FunnelSeries: (x, y, w, h) => this.drawFunnelChart(x, y, w, h),
  BubbleSeries: (x, y, w, h) => this.drawBubbleChart(x, y, w, h),
};

// ✅ Common Handlers (DRY)
private handleChartRender = (x: number, y: number, w: number, h: number, comp: IComponent) => {
  comp.series_type.forEach((series, i) => {
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
  comp.series_type.forEach(series => {
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
  this.ctx.clearRect(0, 0, canvasW, canvasH);

  // Background
  this.ctx.fillStyle = "#F8F9FA";
  this.ctx.fillRect(0, 0, canvasW, canvasH);

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