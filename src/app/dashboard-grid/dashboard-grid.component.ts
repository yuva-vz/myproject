import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-grid',
  templateUrl: './dashboard-grid.component.html',
  styleUrls: ['./dashboard-grid.component.scss']
})
export class DashboardGridComponent implements OnInit {
  // Generate array of 50 dashboard IDs
  dashboards: number[] = Array.from({ length: 50 }, (_, i) => i + 1);
  isLoading = true;
  
  constructor() {}
  
  ngOnInit() {
    // Simulate loading time for better UX
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    
  }
  
  // TrackBy function for better performance
  trackByDashboardId(index: number, dashboardId: number): number {
    return dashboardId;
  }
}
