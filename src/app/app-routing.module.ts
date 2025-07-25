import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './pages/add-task/add-task.component';
import { PendingTasksComponent } from './pages/pending-tasks/pending-tasks.component';
import { CompletedTasksComponent } from './pages/completed-tasks/completed-tasks.component';
import { PrimenggComponent } from './pages/primengg/primengg.component';
import { SvgChartComponent } from './svg-chart/svg-chart.component';
import { SamplesvgComponent } from './samplesvg/samplesvg.component';
import { CombinedDashboardComponent } from './combined-dashboard/combined-dashboard.component';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'add', component: AddTaskComponent },
  { path: 'pending', component: PendingTasksComponent },
  { path: 'completed', component: CompletedTasksComponent },
   { path: 'primeng', component: PrimenggComponent },
   { path: 'svgchart', component: SvgChartComponent },
   { path: 'samplesvg', component: SamplesvgComponent },
   { path: 'combined-dashboard', component: CombinedDashboardComponent },
   { path: 'dashboard', component: DashboardWrapperComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }