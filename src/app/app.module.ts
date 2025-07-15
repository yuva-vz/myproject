import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTaskComponent } from './pages/add-task/add-task.component';
import { PendingTasksComponent } from './pages/pending-tasks/pending-tasks.component';
import { CompletedTasksComponent } from './pages/completed-tasks/completed-tasks.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PrimenggComponent } from './pages/primengg/primengg.component';

// PrimeNG Modules - Complete Import List
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { PaginatorModule } from 'primeng/paginator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';


@NgModule({
  declarations: [
    AppComponent,
    AddTaskComponent,
    PendingTasksComponent,
    CompletedTasksComponent,
    HeaderComponent,
    FooterComponent,
    PrimenggComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    
    // PrimeNG Modules
    MenubarModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    ToggleButtonModule,
    CalendarModule,
    EditorModule,
    PaginatorModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    AutoCompleteModule,
    TooltipModule,
    RippleModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allow unknown/custom tags
  bootstrap: [AppComponent]
})
export class AppModule { }
