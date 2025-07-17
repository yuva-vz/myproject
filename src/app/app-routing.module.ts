import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './pages/add-task/add-task.component';
import { PendingTasksComponent } from './pages/pending-tasks/pending-tasks.component';
import { CompletedTasksComponent } from './pages/completed-tasks/completed-tasks.component';
import { PrimenggComponent } from './pages/primengg/primengg.component';
import { SvgChartComponent } from './svg-chart/svg-chart.component';

const routes: Routes = [
    { path: '', redirectTo: 'add', pathMatch: 'full' },
  { path: 'add', component: AddTaskComponent },
  { path: 'pending', component: PendingTasksComponent },
  { path: 'completed', component: CompletedTasksComponent },
   { path: 'primeng', component: PrimenggComponent },
   { path: 'svgchart', component: SvgChartComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }