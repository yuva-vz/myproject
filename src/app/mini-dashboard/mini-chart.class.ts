import { ElementRef } from "@angular/core";

interface ChartData {
  type: string;
  title: string;
  data: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class MiniChart {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scaleX: number = 1;
  private scaleY: number = 1;
  private chartsData: ChartData[];
  private readonly elementRef: ElementRef<HTMLDivElement>;
  
  private colors = [
    "#005DA6", "#FFC52F", "#BAE1FF", "#75C2FF", "#30A4FF",
    "#00467D", "#CBC53E", "#089AD7", "#6D6E71", "#D0CECE",
    "#DE354C", "#932432", "#3C1874", "#283747", "#DDAF94"
  ];

  constructor(elementRef: ElementRef<HTMLDivElement>, chartsData: ChartData[]) {
    this.chartsData = chartsData;
    this.elementRef = elementRef;
    
    // Create canvas and context
    this.canvas = elementRef.nativeElement.appendChild(document.createElement("canvas"));
    this.ctx = this.canvas.getContext("2d")!;
    this.resizeCanvas();
    this.calculateScales();
    window.addEventListener("resize", () => this.handleResize());
    this.render();
  }

  private resizeCanvas(): void {
    this.canvas.width = this.elementRef.nativeElement.clientWidth;
    this.canvas.height = this.elementRef.nativeElement.clientHeight - 6;
  }

  private calculateScales(): void {
    // Find max x and y coordinates for scaling
    const maxX = Math.max(...this.chartsData.map(chart => chart.position.x + chart.position.width));
    const maxY = Math.max(...this.chartsData.map(chart => chart.position.y + chart.position.height));
    
    this.scaleX = this.canvas.width / (maxX || 100);
    this.scaleY = this.canvas.height / (maxY || 100);
  }

  private handleResize(): void {
    this.resizeCanvas();
    this.calculateScales();
    this.render();
  }

  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Set background
    this.ctx.fillStyle = "#f8f9fa";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render each chart
    this.chartsData.forEach((chart, index) => this.renderChart(chart, index));
  }

  private renderChart(chart: ChartData, index: number): void {
    const x = chart.position.x * this.scaleX;
    const y = chart.position.y * this.scaleY;
    const width = chart.position.width * this.scaleX;
    const height = chart.position.height * this.scaleY;

    // Draw chart background
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeStyle = "#e0e0e0";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, width, height);

    // Draw chart title
    this.ctx.fillStyle = "#333333";
    this.ctx.font = `${Math.max(8, width * 0.08)}px Arial`;
    this.ctx.fillText(chart.title, x + 5, y + 15);

    // Render chart based on type
    const chartArea = {
      x: x + 5,
      y: y + 20,
      width: width - 10,
      height: height - 25
    };

    switch (chart.type) {
      case 'bar':
        this.renderMiniBarChart(chartArea, chart.data);
        break;
      case 'pie':
        this.renderMiniPieChart(chartArea, chart.data);
        break;
      case 'line':
        this.renderMiniLineChart(chartArea, chart.data);
        break;
      case 'donut':
        this.renderMiniDonutChart(chartArea, chart.data);
        break;
      case 'area':
        this.renderMiniAreaChart(chartArea, chart.data);
        break;
      case 'card':
        this.renderMiniCard(chartArea, chart.data);
        break;
      default:
        this.renderPlaceholder(chartArea, chart.type);
    }
  }

  private renderMiniBarChart(area: any, data: number[]): void {
    if (!data || data.length === 0) return;
    
    const maxValue = Math.max(...data);
    const barWidth = area.width / data.length;
    
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * area.height;
      const x = area.x + index * barWidth;
      const y = area.y + area.height - barHeight;
      
      this.ctx.fillStyle = this.colors[index % this.colors.length];
      this.ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    });
  }

  private renderMiniPieChart(area: any, data: number[]): void {
    if (!data || data.length === 0) return;
    
    const centerX = area.x + area.width / 2;
    const centerY = area.y + area.height / 2;
    const radius = Math.min(area.width, area.height) / 2 - 5;
    
    const total = data.reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;
    
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = this.colors[index % this.colors.length];
      this.ctx.fill();
      
      currentAngle += sliceAngle;
    });
  }

  private renderMiniLineChart(area: any, data: number[]): void {
    if (!data || data.length === 0) return;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.colors[0];
    this.ctx.lineWidth = 2;
    
    data.forEach((value, index) => {
      const x = area.x + (index / (data.length - 1)) * area.width;
      const y = area.y + area.height - ((value - minValue) / range) * area.height;
      
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    
    this.ctx.stroke();
  }

  private renderMiniDonutChart(area: any, data: number[]): void {
    if (!data || data.length === 0) return;
    
    const centerX = area.x + area.width / 2;
    const centerY = area.y + area.height / 2;
    const outerRadius = Math.min(area.width, area.height) / 2 - 5;
    const innerRadius = outerRadius * 0.6;
    
    const total = data.reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;
    
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
      this.ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      this.ctx.closePath();
      this.ctx.fillStyle = this.colors[index % this.colors.length];
      this.ctx.fill();
      
      currentAngle += sliceAngle;
    });
  }

  private renderMiniAreaChart(area: any, data: number[]): void {
    if (!data || data.length === 0) return;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    this.ctx.beginPath();
    this.ctx.moveTo(area.x, area.y + area.height);
    
    data.forEach((value, index) => {
      const x = area.x + (index / (data.length - 1)) * area.width;
      const y = area.y + area.height - ((value - minValue) / range) * area.height;
      this.ctx.lineTo(x, y);
    });
    
    this.ctx.lineTo(area.x + area.width, area.y + area.height);
    this.ctx.closePath();
    this.ctx.fillStyle = this.colors[0] + "80";
    this.ctx.fill();
    
    // Draw line
    this.ctx.beginPath();
    data.forEach((value, index) => {
      const x = area.x + (index / (data.length - 1)) * area.width;
      const y = area.y + area.height - ((value - minValue) / range) * area.height;
      
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.strokeStyle = this.colors[0];
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private renderMiniCard(area: any, data: any[]): void {
    this.ctx.fillStyle = "#4CAF50";
    this.ctx.fillRect(area.x, area.y, area.width, area.height);
    
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = `${Math.max(10, area.height * 0.3)}px Arial`;
    this.ctx.textAlign = "center";
    this.ctx.fillText(data[0] || "N/A", area.x + area.width / 2, area.y + area.height / 2);
    this.ctx.textAlign = "left";
  }

  private renderPlaceholder(area: any, type: string): void {
    this.ctx.fillStyle = "#f0f0f0";
    this.ctx.fillRect(area.x, area.y, area.width, area.height);
    
    this.ctx.fillStyle = "#666666";
    this.ctx.font = `${Math.max(8, area.width * 0.1)}px Arial`;
    this.ctx.textAlign = "center";
    this.ctx.fillText(type.toUpperCase(), area.x + area.width / 2, area.y + area.height / 2);
    this.ctx.textAlign = "left";
  }

  public updateData(newChartsData: ChartData[]): void {
    this.chartsData = newChartsData;
    this.calculateScales();
    this.render();
  }

  public destroy(): void {
    window.removeEventListener("resize", () => this.handleResize());
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
