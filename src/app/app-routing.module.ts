import { Routes } from '@angular/router';
import { AddTaskComponent } from './pages/add-task/add-task.component';
import { PendingTasksComponent } from './pages/pending-tasks/pending-tasks.component';
import { CompletedTasksComponent } from './pages/completed-tasks/completed-tasks.component';
import { SvgChartComponent } from './svg-chart/svg-chart.component';
import { SamplesvgComponent } from './samplesvg/samplesvg.component';
import { CombinedDashboardComponent } from './combined-dashboard/combined-dashboard.component';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';
import { ImageDashboardComponent } from './image-dashboard/image-dashboard.component';
import { CanvasDashboardComponent } from './canvas-dashboard/canvas-dashboard.component';
import { SvgCanvasDashboardComponent } from './svg-canvas-dashboard/svg-canvas-dashboard.component';
import { DashboardGridComponent } from './dashboard-grid/dashboard-grid.component';
import { ThumbnailDashboardComponent } from './thumbnail-dashboard/thumbnail-dashboard.component';
import { MiniDashboardComponent } from './mini-dashboard/mini-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'thumbnail-dashboard', pathMatch: 'full' },
  { path: 'add', component: AddTaskComponent },
  { path: 'pending', component: PendingTasksComponent },
  { path: 'completed', component: CompletedTasksComponent },
  // // { path: 'primeng', component: PrimenggComponent },
  // { path: 'svgchart', component: SvgChartComponent },
  // { path: 'samplesvg', component: SamplesvgComponent },
  // { path: 'combined-dashboard', component: CombinedDashboardComponent },
  // { path: 'dashboard', component: DashboardWrapperComponent },
  // { path: 'image-dashboard', component: ImageDashboardComponent },
  // { path: 'canvas-dashboard', component: CanvasDashboardComponent },
  // { path: 'svg-canvas-dashboard', component: SvgCanvasDashboardComponent },
  // { path: 'grid-canvas-dashboard', component: GridCanvasDashboardComponent },
  { path: 'dashboard-grid', component: DashboardGridComponent },
  { path: 'thumbnail-dashboard', component: ThumbnailDashboardComponent },
  { path: 'mini-dashboard', component: MiniDashboardComponent }
];


