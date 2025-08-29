import { ElementRef } from '@angular/core';

interface IComponent {
  x: number;
  y: number;
  width: number;
  height: number;
  component_type: string;
  series_type: string[];
}

// Define types for renderer functions
type ChartRenderer = (x: number, y: number, w: number, h: number) => void;
type ComponentRenderer = (x: number, y: number, w: number, h: number, comp: IComponent) => void;

export class Thumbnail {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scaleX = 1;
  private scaleY = 1;
  private componentsData: IComponent[];
  private readonly elementRef: ElementRef<HTMLDivElement>;
  private readonly colors = [
    '#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BFBCF',
    '#A0C4FF', '#BDB2FF', '#FFC6FF', '#9BF6FF'
  ];

  private readonly config: { 

    map: {
      geomap: { allowed: Set<string>; images: { [key: string]: string } };
      spatialmap: { allowed: Set<string>; images: { [key: string]: string } };
    };
    seriesValidation: { [key: string]: Set<string> };
    chartRenderers: { [key: string]: ChartRenderer };
    componentRenderers: { [key: string]: ComponentRenderer };
  } = {
    map: {
      geomap: {
        allowed: new Set(['GeoMapSeries', 'GeomapBubbleSeries', 'HeatMapSeries', 'ChoroplethSeries']),
        images: {
          GeoMapSeries: 'assets/map1%20.webp',
          GeomapBubbleSeries: 'assets/aaaa.webp',
          // HeatMapSeries: 'assets/heatmap.webp',
          // ChoroplethSeries: 'assets/choropleth.webp'
        }
      },
      spatialmap: {
        allowed: new Set(['SpatialMapBubbleSeries', 'SpatialMapSeries', 'SpatialPolygonSeries']),
        images: {
          SpatialMapBubbleSeries: 'assets/map4.svg',
          SpatialMapSeries: 'assets/map2.webp',
          // SpatialPolygonSeries: 'assets/spatial-polygon.svg'
        }
      }
    },
    seriesValidation: {
      grid: new Set(['TableRowSeries', 'TableColumnSeries']),
      pivot: new Set(['PivotRowSeries', 'PivotColumnSeries']),
      card: new Set(['ValueSeries']),
      filter: new Set(['DropdownSeries', 'ButtonSeries']),
      text: new Set(['TextSeries']),
      image: new Set<string>()
    },
    chartRenderers: {
      LineSeries: (x, y, w, h) => this.drawLine(x, y, w, h, false, false),
      AreaSeries: (x, y, w, h) => this.drawLine(x, y, w, h, true, false),
      ClusterLineSeries: (x, y, w, h) => this.drawLine(x, y, w, h, false, true),
      ClusterAreaSeries: (x, y, w, h) => this.drawLine(x, y, w, h, true, true),
      ColumnSeries: (x, y, w, h) => this.drawBars(x, y, w, h, 'column'),
      BarSeries: (x, y, w, h) => this.drawBars(x, y, w, h, 'bar'),
      ClusterBarSeries: (x, y, w, h) => this.drawBars(x, y, w, h, 'cluster'),
      StackedColumnSeries: (x, y, w, h) => this.drawBars(x, y, w, h, 'stacked-column'),
      StackedBarSeries: (x, y, w, h) => this.drawBars(x, y, w, h, 'stacked-row'),
      PieSeries: (x, y, w, h) => this.drawCircular(x, y, w, h, false),
      DonutSeries: (x, y, w, h) => this.drawCircular(x, y, w, h, true),
      RadarLine: (x, y, w, h) => this.drawRadar(x, y, w, h, 'line'),
      RadarArea: (x, y, w, h) => this.drawRadar(x, y, w, h, 'area'),
      ClusterLineRadar: (x, y, w, h) => this.drawRadar(x, y, w, h, 'clusterline'),
      ClusterAreaRadar: (x, y, w, h) => this.drawRadar(x, y, w, h, 'clusterarea'),
      ScatterSeries: (x, y, w, h) => this.drawScatter(x, y, w, h),
      BubbleSeries: (x, y, w, h) => this.drawBubble(x, y, w, h),
      TreeMapSeries: (x, y, w, h) => this.drawTreemap(x, y, w, h),
      FunnelSeries: (x, y, w, h) => this.drawFunnel(x, y, w, h),
      WaterFallSeries: (x, y, w, h) => this.drawWaterfall(x, y, w, h),
      GaugeSeries: (x, y, w, h) => this.drawGauge(x, y, w, h),
      CombinationChart: (x, y, w, h) => this.drawCombinationChartGeneric(x, y, w, h, 'normal'),
      StackedCombinationChart: (x, y, w, h) => this.drawCombinationChartGeneric(x, y, w, h, 'stacked'),
      RadialSeries: (x, y, w, h) => this.drawRadialChart(x, y, w, h, 'radial'),
      RadialStackedChart: (x, y, w, h) => this.drawRadialChart(x, y, w, h, 'stacked'),
      RadarColumn: (x, y, w, h) => this.drawRadarColumn(x, y, w, h, 'single'),
      RadarColumnStacked: (x, y, w, h) => this.drawRadarColumn(x, y, w, h, 'stacked'),
      RadarColumnCluster: (x, y, w, h) => this.drawRadarColumn(x, y, w, h, 'cluster')
    },
    componentRenderers: {
      chart: (x, y, w, h, comp) => this.drawChart(x, y, w, h, comp.series_type),
      grid: (x, y, w, h, comp) => this.handleTableRender(x, y, w, h, comp, 'grid'),
      pivot: (x, y, w, h, comp) => this.handleTableRender(x, y, w, h, comp, 'pivot'),
      card: (x, y, w, h, comp) => this.drawCard(x, y, w, h, comp),
      image: (x, y, w, h, comp) => this.drawImage(x, y, w, h),
      filter: (x, y, w, h, comp) => this.drawFilter(x, y, w, h, comp),
      text: (x, y, w, h, comp) => this.drawTextBox(x, y, w, h, comp),
      geomap: (x, y, w, h, comp) => this.drawMap(x, y, w, h, comp),
      spatialmap: (x, y, w, h, comp) => this.drawMap(x, y, w, h, comp)
    }
  };

  constructor(elementRef: ElementRef<HTMLDivElement>, componentsData: IComponent[]) {
    if (!elementRef?.nativeElement || !Array.isArray(componentsData)) {
      throw new Error('Invalid constructor inputs');
    }
    this.componentsData = componentsData;
    this.elementRef = elementRef;
    this.canvas = elementRef.nativeElement.appendChild(document.createElement('canvas'));
    this.ctx = this.canvas.getContext('2d')!;
    this.init();
  }

  private init(): void {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    const { clientWidth, clientHeight } = this.elementRef.nativeElement;
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight - 6;
    this.calculateScales();
    this.render();
  }

  private calculateScales(): void {
    const maxX = 60;
    const maxY = 60;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    this.scaleX = cw / maxX;
    this.scaleY = ch / maxY;
  }

  private rnd(count: number, min = 40, max = 100): number[] {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min) + min));
  }

  private setStyle(fill?: string, stroke?: string, lineWidth = 2): void {
    if (fill) this.ctx.fillStyle = fill;
    if (stroke) {
      this.ctx.strokeStyle = stroke;
      this.ctx.lineWidth = lineWidth;
    }
  }

  private drawLine(x: number, y: number, w: number, h: number, isArea: boolean, isCluster: boolean): void {
    let colors: string[];
    if (isCluster) {
      colors = isArea ? [this.colors[8], this.colors[6]] : [this.colors[8], this.colors[6]];
    } else {
      colors = isArea ? [this.colors[7]] : [this.colors[0]];
    }

    const drawPath = (data: number[], color: string, offset = 0): void => {
      const max = Math.max(...data);
      const step = w / (data.length - 1);
      const coords = data.map((v, i) => ({ x: x + i * step, y: y + h - (v / max * h) + offset }));
      this.ctx.beginPath();
      coords.forEach((p, i) => (i ? this.ctx.lineTo(p.x, p.y) : this.ctx.moveTo(p.x, p.y)));
      if (isArea) {
        this.ctx.lineTo(coords[coords.length - 1].x, y + h);
        this.ctx.lineTo(coords[0].x, y + h);
        this.ctx.closePath();
        this.setStyle(color + '80');
        this.ctx.fill();
      }
      this.setStyle(undefined, color);
      this.ctx.stroke();
    };

    drawPath(this.rnd(7, 10, 80), colors[0]);
    if (isCluster) drawPath(this.rnd(7, 10, 90), colors[1], -10);
  }

  private drawBars(x: number, y: number, w: number, h: number, type: string): void {
    const isVertical = type.includes('column');
    const gap = 3;
    const baseY = y + h;
    const baseX = x;

    if (type === 'cluster') {
      const data1 = this.rnd(7);
      const data2 = this.rnd(7);
      const max = Math.max(...data1, ...data2);
      const clusterGap = 5;
      const clusters = data1.length;
      const totalGaps = gap * (clusters + 1);
      const totalClusterWidth = w - totalGaps;
      const clusterWidth = totalClusterWidth / clusters;
      const barWidth = (clusterWidth - clusterGap) / 2;

      data1.forEach((val, i) => {
        const barHeight1 = (val / max) * (h - gap);
        const barHeight2 = (data2[i] / max) * (h - gap);
        const xPos = x + gap + i * (clusterWidth + gap);

        this.setStyle(this.colors[0]);
        this.ctx.fillRect(xPos, baseY - barHeight1, barWidth, barHeight1);

        this.setStyle(this.colors[8]);
        this.ctx.fillRect(xPos + barWidth + clusterGap, baseY - barHeight2, barWidth, barHeight2);
      });
    } else {
      const data = this.rnd(7);
      const max = Math.max(...data);
      const barCount = data.length;
      const totalGaps = gap * (barCount + 1);
      const availableSpace = isVertical ? w - totalGaps : h - totalGaps;
      const barThickness = availableSpace / barCount;

      data.forEach((val, i) => {
        if (isVertical) {
          const barWidth = barThickness;
          const barHeight = (val / max) * (h - gap);
          const xPos = x + gap + i * (barWidth + gap);
          const yPos = baseY - barHeight;

          if (type.includes('stacked')) {
            const halfHeight = barHeight / 2;
            this.setStyle(this.colors[1]);
            this.ctx.fillRect(xPos, yPos + halfHeight, barWidth, halfHeight);
            this.setStyle(this.colors[2]);
            this.ctx.fillRect(xPos, yPos, barWidth, halfHeight);
          } else {
            this.setStyle(this.colors[5]);
            this.ctx.fillRect(xPos, yPos, barWidth, barHeight);
          }
        } else {
          const barHeight = barThickness;
          const barWidth = (val / max) * (w - gap);
          const xPos = baseX;
          const yPos = y + gap + i * (barHeight + gap);

          if (type.includes('stacked')) {
            const halfWidth = barWidth / 2;
            this.setStyle(this.colors[1]);
            this.ctx.fillRect(xPos, yPos, halfWidth, barHeight);
            this.setStyle(this.colors[2]);
            this.ctx.fillRect(xPos + halfWidth, yPos, halfWidth, barHeight);
          } else {
            this.setStyle(this.colors[1]);
            this.ctx.fillRect(xPos, yPos, barWidth, barHeight);
          }
        }
      });
    }
  }

  private drawCircular(x: number, y: number, w: number, h: number, isDonut: boolean): void {
    const data = this.rnd(6, 20, 60);
    const total = data.reduce((a, b) => a + b, 0);
    const R = Math.min(w, h) / 2;
    const cx = x + w / 2;
    const cy = y + h / 2;
    let angle = 0;

    data.forEach((val, i) => {
      const slice = (val / total) * Math.PI * 2;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, R, angle, angle + slice);
      if (isDonut) this.ctx.arc(cx, cy, R / 2, angle + slice, angle, true);
      else this.ctx.lineTo(cx, cy);
      this.ctx.closePath();
      this.setStyle(this.colors[i % this.colors.length], '#fff', 1);
      this.ctx.fill();
      this.ctx.stroke();
      angle += slice;
    });
  }

  private drawRadar(
    x: number,
    y: number,
    w: number,
    h: number,
    mode: 'area' | 'line' | 'clusterline' | 'clusterarea'
  ): void {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const R = Math.min(w, h) / 2 - 5;
    const axes = 7;

    const randomDataset = () => Array.from({ length: axes }, () => 0.5 + Math.random() * 0.5);
    const datasets = mode.startsWith('cluster') ? [randomDataset(), randomDataset()] : [randomDataset()];

    datasets.forEach((values, idx) => {
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < axes; i++) {
        const angle = (i / axes) * 2 * Math.PI - Math.PI / 2;
        const val = values[i];
        points.push({
          x: cx + Math.cos(angle) * R * val,
          y: cy + Math.sin(angle) * R * val
        });
      }

      this.ctx.beginPath();
      points.forEach((pt, i) => (i === 0 ? this.ctx.moveTo(pt.x, pt.y) : this.ctx.lineTo(pt.x, pt.y)));
      this.ctx.closePath();

      let fillColor = '';
      let strokeColor = '';
      if (mode === 'clusterline') {
        strokeColor = idx === 0 ? this.colors[1] : this.colors[6];
      } else if (mode === 'clusterarea') {
        fillColor = idx === 0 ? this.colors[0] + '70' : this.colors[6] + '70';
        strokeColor = idx === 0 ? this.colors[0] : this.colors[6];
      } else if (mode === 'area') {
        fillColor = this.colors[6] + '70';
        strokeColor = this.colors[6];
      } else {
        strokeColor = this.colors[6];
      }

      if (mode.endsWith('area')) {
        if (fillColor) this.setStyle(fillColor);
        else this.setStyle(this.colors[6] + '70');
        this.ctx.fill();
        this.setStyle(undefined, strokeColor || this.colors[6]);
        this.ctx.stroke();
      } else {
        this.setStyle(undefined, strokeColor || this.colors[6], 2);
        this.ctx.stroke();
      }

      for (const pt of points) {
        this.ctx.beginPath();
        this.ctx.arc(pt.x, pt.y, 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = strokeColor || this.colors[6];
        this.ctx.fill();
        this.ctx.strokeStyle = strokeColor || this.colors[6];
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      }
    });
  }

  private drawScatter(x: number, y: number, w: number, h: number): void {
    this.setStyle('#fff');
    this.ctx.fillRect(x, y, w, h);
    for (let i = 0; i < 75; i++) {
      this.ctx.beginPath();
      this.ctx.arc(x + Math.random() * w, y + Math.random() * h, 3, 0, Math.PI * 2);
      this.setStyle(this.colors[6]);
      this.ctx.fill();
    }
  }

  private drawBubble(x: number, y: number, w: number, h: number): void {
    Array.from({ length: 8 }, () => ({
      x: x + Math.random() * w * 0.8 + w * 0.1,
      y: y + Math.random() * h * 0.8 + h * 0.1,
      r: Math.min(w, h) * (0.04 + Math.random() * 0.08)
    })).forEach(({ x: bx, y: by, r }) => {
      this.ctx.beginPath();
      this.ctx.arc(bx, by, r, 0, 2 * Math.PI);
      this.setStyle(this.colors[6], '#BDB2FF40', 1);
      this.ctx.fill();
      this.ctx.stroke();
    });
  }

  private drawTreemap(x: number, y: number, w: number, h: number): void {
    const areas = [0.4, 0.4, 0.25, 1, 0.3, 0.2, 0.15, 3];
    let curX = x;
    let curY = y;
    let remW = w;
    let remH = h;

    areas.forEach((a, i) => {
      const isHoriz = i % 2 === 0;
      const rectW = isHoriz ? remW * a : remW;
      const rectH = isHoriz ? remH : remH * a;
      this.setStyle(this.colors[i % this.colors.length], '#fff', 1);
      this.ctx.fillRect(curX, curY, rectW, rectH);
      this.ctx.strokeRect(curX, curY, rectW, rectH);
      if (isHoriz) {
        curX += rectW;
        remW -= rectW;
      } else {
        curY += rectH;
        remH -= rectH;
      }
    });
  }

  private drawFunnel(x: number, y: number, w: number, h: number): void {
    const stages = 6;
    const sh = h / stages;

    for (let i = 0; i < stages; i++) {
      const rectW = w * (1 - i * 0.15);
      const rectX = x + (w - rectW) / 2;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];

      this.ctx.beginPath();
      this.ctx.rect(rectX, y + i * sh, rectW, sh - 2);
      this.setStyle(color, color);
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  private drawWaterfall(x: number, y: number, w: number, h: number): void {
    const bars = 6;
    const gap = 10;
    const barW = Math.max((w - (bars + 1) * gap) / bars, 1);
    let currentY = y + h;
    const heights = [0.2, 0.17, 0.13, 0.1, 0.13, 0.17].map(f => h * f);

    heights.forEach((barH, i) => {
      currentY -= barH;
      if (currentY < y) return;
      this.ctx.rect(x + gap + i * (barW + gap), currentY, barW, barH);
      this.setStyle(this.colors[0]);
      this.ctx.fill();
    });
  }

  private drawGauge(x: number, y: number, w: number, h: number): void {
    const cx = x + w / 2;
    const cy = y + h * 0.9;
    const radius = Math.min(w, h) * 0.6;
    const value = this.rnd(1, 10, 90)[0];
    const angle = Math.PI + (value / 100) * Math.PI;

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, Math.PI, 0, false);
    this.ctx.lineTo(cx, cy);
    this.ctx.closePath();
    this.setStyle('#eee');
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, Math.PI, angle, false);
    this.ctx.lineTo(cx, cy);
    this.ctx.closePath();
    this.setStyle(this.colors[7]);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(cx + radius * 0.9 * Math.cos(angle), cy + radius * 0.9 * Math.sin(angle));
    this.setStyle(undefined, '#333');
    this.ctx.stroke();

    this.ctx.font = `${Math.floor(h * 0.25)}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.setStyle('#333');
    this.ctx.fillText(`${value}`, cx, cy - radius * 0.3);
  }

  private drawCombinationChartGeneric(x: number, y: number, w: number, h: number, type: 'normal' | 'stacked'): void {
    const bar = this.rnd(4, 20, 80);
    const s1 = this.rnd(4, 10, 50);
    const s2 = this.rnd(4, 10, 50);
    const line = type === 'normal' ? this.rnd(4, 10, 80) : this.rnd(4, 20, 100);
    const vals = type === 'normal' ? bar : s1.map((v, i) => v + s2[i]);
    const bw = w / 4 / 2;
    const max = Math.max(...vals, ...line);

    for (let i = 0; i < 4; i++) {
      const x0 = x + i * (w / 4) + bw / 2;
      if (type === 'normal') {
        this.setStyle(this.colors[5]);
        this.ctx.fillRect(x0, y + h - (bar[i] / max) * h, bw, (bar[i] / max) * h);
      } else {
        const h1 = (s1[i] / max) * h;
        const h2 = (s2[i] / max) * h;
        this.setStyle(this.colors[5]);
        this.ctx.fillRect(x0, y + h - h1, bw, h1);
        this.setStyle(this.colors[1]);
        this.ctx.fillRect(x0, y + h - h1 - h2, bw, h2);
      }
    }

    this.ctx.beginPath();
    line.forEach((v, i) => {
      const px = x + i * (w / 4) + bw;
      const py = y + h - (v / max) * h;
      i ? this.ctx.lineTo(px, py) : this.ctx.moveTo(px, py);
    });
    this.ctx.lineTo(x + 3 * (w / 4) + bw, y + h);
    this.ctx.lineTo(x + bw, y + h);
    this.ctx.closePath();
    this.setStyle(this.colors[4] + '50');
    this.ctx.fill();

    this.ctx.beginPath();
    this.setStyle(undefined, this.colors[0]);
    line.forEach((v, i) => {
      const px = x + i * (w / 4) + bw;
      const py = y + h - (v / max) * h;
      i ? this.ctx.lineTo(px, py) : this.ctx.moveTo(px, py);
    });
    this.ctx.stroke();
  }

  private drawRadialChart(x: number, y: number, w: number, h: number, chartType: 'radial' | 'stacked' = 'radial'): void {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const t = 4;
    const gap = 1;
    const outerR = Math.max(0, Math.min(w, h) / 2 - 10);
    let vals: (number | number[])[];
    let mode: 'radar' | 'clustered';

    if (chartType === 'radial') {
      vals = this.rnd(5, 10, 100);
      mode = 'radar';
    } else {
      vals = Array.from({ length: 5 }, () => this.rnd(2, 10, 40));
      mode = 'clustered';
    }

    const max = Math.max(...vals.map(v => (Array.isArray(v) ? v.reduce((a, b) => a + b, 0) : v)));

    vals.forEach((val, i) => {
      const r = outerR - i * (t + gap) + 5;
      if (r <= 0) {
        console.warn(`Skipped ring ${i}, invalid radius:`, r);
        return;
      }

      const arr = Array.isArray(val) ? val : [val];
      let sa = -Math.PI / 2;

      arr.forEach((v, j) => {
        const a = (v / max) * Math.PI * 1.6;
        const innerR = r - t;

        if (innerR <= 0) {
          console.warn(`Skipped inner ring ${i}, invalid innerR:`, innerR);
          return;
        }

        this.ctx.beginPath();
        if (mode === 'radar') {
          this.setStyle(this.colors[7], this.colors[0]);
        } else {
          const fillColor = this.colors[Math.floor(Math.random() * this.colors.length)];
          const strokeColor = this.colors[Math.floor(Math.random() * this.colors.length)];
          this.setStyle(fillColor, strokeColor);
        }

        this.ctx.arc(cx, cy, r, sa, sa + a);
        this.ctx.lineTo(cx + innerR * Math.cos(sa + a), cy + innerR * Math.sin(sa + a));
        this.ctx.arc(cx, cy, innerR, sa + a, sa, true);
        this.ctx.closePath();
        this.ctx.fill();
        sa += a;
      });
    });
  }

  private drawRadarColumn(x: number, y: number, w: number, h: number, mode: string): void {
    const points = 8;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const radius = Math.min(w, h) / 2 - 10;
    const datasets = mode === 'single' ? [this.rnd(points, 10, 100)] : Array.from({ length: 3 }, () => this.rnd(points, 10, 40));
    const sliceAngle = (2 * Math.PI) / points;

    for (let i = 0; i < points; i++) {
      if (mode === 'stacked') {
        let cumulative = 0;
        datasets.forEach((ds, d) => {
          const r = (ds[i] / 100) * radius + 3;
          this.ctx.beginPath();
          this.ctx.moveTo(cx, cy);
          this.ctx.arc(cx, cy, cumulative + r, i * sliceAngle, (i + 1) * sliceAngle);
          this.ctx.closePath();
          this.setStyle(this.colors[i % this.colors.length], '#fff', 1);
          this.ctx.fill();
          this.ctx.stroke();
          cumulative += r;
        });
      } else if (mode === 'cluster') {
        const clusterWidth = sliceAngle / datasets.length;
        datasets.forEach((ds, d) => {
          const r = (ds[i] / 100) * radius + 20;
          const start = i * sliceAngle + d * clusterWidth;
          this.ctx.beginPath();
          this.ctx.moveTo(cx, cy);
          this.ctx.arc(cx, cy, r, start, start + clusterWidth + 1e-61);
          this.ctx.closePath();
          this.setStyle(this.colors[i % this.colors.length], '#fff', 1);
          this.ctx.fill();
          this.ctx.stroke();
        });
      } else {
        const r = (datasets[0][i] / 100) * radius + 10;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.arc(cx, cy, r, i * sliceAngle, (i + 1) * sliceAngle);
        this.ctx.closePath();
        this.setStyle(this.colors[3], '#fff', 1);
        this.ctx.fill();
        this.ctx.stroke();
      }
    }
  }

  private drawTableChart(x: number, y: number, w: number, h: number, mode: 'pivot' | 'grid'): void {
    const rows = 6;
    const cols = 6;
    const cellW = w / cols;
    const cellH = h / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = mode === 'grid'
          ? (r % 2 === 0 ? this.colors[0] : '#fff')
          : (r === 0 || c === 0 ? 'rgba(255,0,0,0.3)' : (r + c) % 2 === 0 ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.1)');
        this.setStyle(color);
        this.ctx.fillRect(x + c * cellW, y + r * cellH, cellW, cellH);
        this.setStyle(undefined, '#ddd');
        this.ctx.strokeRect(x + c * cellW, y + r * cellH, cellW, cellH);
      }
    }
  }

  private drawCard(x: number, y: number, w: number, h: number, comp: IComponent): void {
    const validSeries = comp.series_type.filter(s => this.config.seriesValidation['card']?.has(s) || false);
    if (!validSeries.length) {
      console.warn(`Invalid card series: ${comp.series_type.join(', ')}`);
      return;
    }
    this.setStyle('#fff', '#fff');
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.font = `${Math.min(w / 6, h / 3)}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.setStyle('#2C3E50');
    this.ctx.fillStyle = '#000000';
    this.ctx.fillText('21.2k ▲', x + w / 2, y + h / 2 - h * 0.08);
  }

  private drawFilter(x: number, y: number, w: number, h: number, comp: IComponent): void {
    const validSeries = comp.series_type.filter(s => this.config.seriesValidation['filter']?.has(s) || false);
    if (!validSeries.length) {
      console.warn(`Invalid filter series: ${comp.series_type.join(', ')}`);
      return;
    }
    if (validSeries.length > 1) {
      console.error(`Multiple filter series: ${validSeries.join(', ')}`);
      return;
    }

    const headerH = h * 0.2;
    if (validSeries[0] === 'DropdownSeries') {
      this.setStyle('#9E9E9E', '#fff', 2);
      this.ctx.fillRect(x, y, w, headerH);
      this.ctx.strokeRect(x, y, w, headerH);
      this.setStyle('#CED4DA');
      this.ctx.fillRect(x, y + headerH, w, h - headerH);
      this.setStyle('#9E9E9E', '#fff', 2);
      for (let i = 0; i <= 2; i++) {
        const lineY = y + headerH + i * ((h - headerH) / 3);
        this.ctx.beginPath();
        this.ctx.moveTo(x, lineY);
        this.ctx.lineTo(x + w, lineY);
        this.ctx.stroke();
      }
      this.ctx.strokeRect(x, y + headerH, w, h - headerH);
      this.ctx.font = `${headerH * 0.9}px Arial`;
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'middle';
      this.setStyle('rgba(255, 255, 255, 1)');
      this.ctx.fillText('▼', x + w - 8, y + headerH / 2);
    } else {
      const btnW = w * 0.6;
      const btnH = h * 0.4;
      const btnX = x + (w - btnW) / 2;
      const btnY = y + (h - btnH) / 2;
      this.setStyle('#FFADAD', '#000');
      this.ctx.fillRect(btnX, btnY, btnW + 10, btnH);
      this.ctx.font = `${btnH * 0.5}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.setStyle('#fff');
      this.ctx.fillText('🔍 Button', btnX + btnW / 2, btnY + btnH / 2);
    }
  }

  private drawTextBox(x: number, y: number, w: number, h: number, comp: IComponent): void {
    const validSeries = comp.series_type.filter(s => this.config.seriesValidation['text']?.has(s) || false);
    if (!validSeries.length) {
      console.warn(`Invalid text series: ${comp.series_type.join(', ')}`);
      return;
    }

    const padding = Math.min(w, h) * 0.08;
    const innerX = x + padding;
    const innerY = y + padding;
    const innerW = w - 2 * padding;
    const innerH = h - 2 * padding;

    this.setStyle('#fff', '#fff');
    this.ctx.fillRect(innerX, innerY, innerW, innerH);
    this.ctx.strokeRect(innerX, innerY, innerW, innerH);

    this.ctx.fillStyle = '#222';
    this.ctx.font = `bold ${Math.min(innerW, innerH) * 0.13}px Arial`;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('Heading', innerX + 10, innerY + 5);

    const paragraph = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`;
    this.ctx.fillStyle = '#222';
    this.ctx.font = `${Math.min(innerW, innerH) * 0.11}px Arial`;
    const lineHeight = Math.min(innerW, innerH) * 0.14;
    const words = paragraph.split(' ');
    let line = '';
    let ty = innerY + innerH * 0.20;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const testWidth = this.ctx.measureText(testLine).width;

      if (testWidth > innerW - 20 && n > 0) {
        this.ctx.fillText(line.trim(), innerX + 10, ty);
        line = words[n] + ' ';
        ty += lineHeight;
        if (ty > innerY + innerH - lineHeight) break;
      } else {
        line = testLine;
      }
    }
    if (line) {
      this.ctx.fillText(line.trim(), innerX + 10, ty);
    }
  }

  private drawImage(x: number, y: number, w: number, h: number): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/img.svg';
    img.onload = () => {
      this.ctx.clearRect(x, y, w, h);
      this.ctx.drawImage(img, x, y, w, h);
      this.setStyle(undefined, '#000', 2);
      this.ctx.strokeRect(x, y, w, h);
    };
  }

  private drawMap(x: number, y: number, w: number, h: number, comp: IComponent): void {
    const mapConfig = this.config.map[comp.component_type as 'geomap' | 'spatialmap'];
    if (!mapConfig) {
      console.warn(`Invalid map component: ${comp.component_type}`);
      return;
    }

    const validSeries = comp.series_type.filter(s => mapConfig.allowed.has(s));
    if (!validSeries.length) {
      console.warn(`Invalid map series: ${comp.series_type.join(', ')}`);
      return;
    }

    validSeries.forEach(series => {
      const imgSrc = mapConfig.images[series];
      if (!imgSrc) {
        console.warn(`No image for series: ${series}`);
        return;
      }
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        this.ctx.drawImage(img, x, y, w, h);
        this.setStyle(undefined, '#fff', 2);
        this.ctx.strokeRect(x, y, w, h);
      };
      img.onerror = () => console.error(`Failed to load image: ${img.src}`);
    });
  }

  private handleTableRender(x: number, y: number, w: number, h: number, comp: IComponent, mode: 'pivot' | 'grid'): void {
    const validSeries = comp.series_type.filter(s => this.config.seriesValidation[comp.component_type]?.has(s) || false);
    if (!validSeries.length) {
      console.warn(`Invalid ${mode} series: ${comp.series_type.join(', ')}`);
      return;
    }
    this.drawTableChart(x, y, w, h, mode);
  }

  private drawChart(x: number, y: number, w: number, h: number, series: string[]): void {
    const validSeries = series.filter(s => Object.prototype.hasOwnProperty.call(this.config.chartRenderers, s));
    if (!validSeries.length) {
      console.warn(`Invalid chart series: ${series.join(', ')}`);
      return;
    }
    validSeries.forEach(s => this.config.chartRenderers[s](x, y, w, h));
  }

  public render(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.setStyle('#ffffff');
    this.ctx.fillRect(0, 0, width, height);

    const maxUnitsX = 60;
    const maxUnitsY = 60;

    this.componentsData.forEach(comp => {
      const componentType = comp.component_type?.toLowerCase();
      if (!componentType || !Object.prototype.hasOwnProperty.call(this.config.componentRenderers, componentType)) {
        console.warn(`Invalid component type: ${comp.component_type}`);
        return;
      }

      const { x, y, width: unitW, height: unitH } = comp;

      if (x >= maxUnitsX || y >= maxUnitsY) {
        return;
      }

      const clampedX = Math.max(0, Math.min(x, maxUnitsX - unitW));
      const clampedY = Math.max(0, Math.min(y, maxUnitsY - unitH));
      const scaledXX = clampedX * this.scaleX;
      const scaledYY = clampedY * this.scaleY;
      const w = unitW * this.scaleX;
      const h = unitH * this.scaleY;

      this.config.componentRenderers[componentType](scaledXX, scaledYY, w, h, comp);
    });
  }

  public destroy(): void {
    window.removeEventListener('resize', () => this.resize());
    this.canvas.parentElement?.removeChild(this.canvas);
  }
}