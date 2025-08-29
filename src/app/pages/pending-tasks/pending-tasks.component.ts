import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-pending-tasks',
  templateUrl: './pending-tasks.component.html',
  styleUrls: ['./pending-tasks.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PendingTasksComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasksObservable().subscribe(all => {
      this.tasks = all.filter(t => t.status === 'P');
    });
  }

  markCompleted(task: Task) {
    task.status = 'C';
    this.taskService.updateTask(task);
    alert('Marked as completed');
  }
  getStatusText(status: string): string {
    return status === 'C' ? 'Completed' : 'Pending';
  }
}