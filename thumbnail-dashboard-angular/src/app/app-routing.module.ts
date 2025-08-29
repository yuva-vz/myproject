import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThumbnailDashboardComponent } from './thumbnail-dashboard/thumbnail-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: ThumbnailDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }