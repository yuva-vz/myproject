import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-completed-tasks',
  templateUrl: './completed-tasks.component.html',
  styleUrls: ['./completed-tasks.component.scss']
})
export class CompletedTasksComponent implements OnInit {
  tasks: Task[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = 'success'; // 'success' or 'error'

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasksObservable().subscribe(all => {
      this.tasks = all.filter(t => t.status === 'C');
    });
  }

  // Track by function for better performance
  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  // Get status text for display
  getStatusText(status: string): string {
    return status === 'C' ? 'Completed' : 'Pending';
  }

  // Get current date
  getCurrentDate(): Date {
    return new Date();
  }

  // Reopen task functionality
  reopenTask(task: Task) {
    task.status = 'P';
    this.taskService.updateTask(task);
    this.showCustomAlert('Task reopened and moved to pending!', 'success');
  }

  // Custom alert functionality
  showCustomAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  closeAlert() {
    this.showAlert = false;
  }
}
