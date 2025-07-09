import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
// import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  taskForm = this.fb.group({
    name: ['', [
      Validators.required, 
      Validators.minLength(3),
      Validators.maxLength(20), 
      Validators.pattern(/^[a-zA-Z0-9 ]+$/)
    ]],
    description: ['', [Validators.minLength(5)]],
    startDate: [''],
    endDate: [''],
    targetDate: ['', Validators.required],
    status: ['P']
  });

  submitted = false;
  showAlert = false;
  alertMessage = '';
  alertType = 'error'; // 'error' or 'success'
  today: Date = new Date();
  userPhoto: string | null = null;
  isPhotoHovered = false;

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  // Getter methods for easy access to form controls
  get name() { return this.taskForm.get('name'); }
  get description() { return this.taskForm.get('description'); }
  get targetDate() { return this.taskForm.get('targetDate'); }

  // Methods to check for specific validation errors
  hasNameError(errorType: string): boolean {
    return this.name?.hasError(errorType) && (this.name?.dirty || this.name?.touched || this.submitted) || false;
  }

  hasDescriptionError(errorType: string): boolean {
    return this.description?.hasError(errorType) && (this.description?.dirty || this.description?.touched || this.submitted) || false;
  }

  hasTargetDateError(errorType: string): boolean {
    return this.targetDate?.hasError(errorType) && (this.targetDate?.dirty || this.targetDate?.touched || this.submitted) || false;
  }

  onSubmit() {
    this.submitted = true;
    
    // Check specifically if target date is missing
    // if (!this.targetDate?.value) {
    //   this.showCustomAlert('Please enter the target date before adding the task!', 'error');
    //   this.taskForm.markAllAsTouched();
    //   return;
    // }
    
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const newTask: Task = {
        id: Date.now(),
        name: formValue.name ?? '',
        description: formValue.description ?? '',
        startDate: formValue.startDate ?? '',
        endDate: formValue.endDate ?? '',
        targetDate: formValue.targetDate ?? '',
        status: (formValue.status as 'P' | 'C') ?? 'P'
      };
      console.log('Adding new task:', newTask);
      this.taskService.addTask(newTask);
      this.showCustomAlert('Task added successfully!', 'success');
      this.taskForm.reset({ status: 'P' });
      this.submitted = false;
    } else {
      // Show single alert for other validation errors
      this.showCustomAlert('Please fill in all required fields correctly!', 'error');
      this.taskForm.markAllAsTouched();
      
    }
  }

  showCustomAlert(message: string, type: 'error' | 'success') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    
    // Auto hide after 4 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }

  closeAlert() {
    this.showAlert = false;
  }

  // Photo upload functionality
  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    console.log('File input:', fileInput);
    if (fileInput) {
      fileInput.click();
    }
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.userPhoto = e.target.result;
          console.log('Photo uploaded:', this.userPhoto);
        };
        reader.readAsDataURL(file);
      } else {
        this.showCustomAlert('Please select a valid image file!', 'error');
      }
    }
  }

  // Photo hover functionality
  onPhotoHover(isHovered: boolean) {
    this.isPhotoHovered = isHovered;
  }
}
