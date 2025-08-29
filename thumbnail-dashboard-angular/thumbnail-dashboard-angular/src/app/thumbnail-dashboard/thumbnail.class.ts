export class Thumbnail {
  private container: HTMLElement;
  private data: any[];

  constructor(containerRef: ElementRef<HTMLDivElement>, data: any[]) {
    this.container = containerRef.nativeElement;
    this.data = data;
    this.render();
  }

  render(): void {
    this.container.innerHTML = '';
    this.data.forEach(dashboard => {
      const dashboardElement = this.createDashboardElement(dashboard);
      this.container.appendChild(dashboardElement);
    });
  }

  private createDashboardElement(dashboard: any): HTMLElement {
    const dashboardDiv = document.createElement('div');
    dashboardDiv.className = 'dashboard';
    dashboardDiv.style.width = 'calc(100% / 5)'; // Adjust for responsive grid
    dashboardDiv.innerHTML = `
      <h3>${dashboard.id}: ${dashboard.name}</h3>
    `;
    return dashboardDiv;
  }

  destroy(): void {
    this.container.innerHTML = '';
  }
}