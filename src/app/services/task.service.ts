import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task';
// import { Task } from '../../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private STORAGE_KEY = 'jjj';
  private tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(this.getFromStorage());

  private getFromStorage(): Task[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    console.log('Retrieved tasks from storage:', data);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(tasks: Task[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    this.tasks$.next(tasks);
  }

  getTasksObservable() {
    return this.tasks$.asObservable();
  }

  addTask(task: Task) {
    const tasks = this.getFromStorage();
    tasks.push(task);
    this.saveToStorage(tasks);
  }

  updateTask(updated: Task) {
    const tasks = this.getFromStorage().map(t => t.id === updated.id ? updated : t);
    this.saveToStorage(tasks);
  }
}
