import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-dashboard',
  templateUrl: './image-dashboard.component.html',
  styleUrl: './image-dashboard.component.scss'
})
export class ImageDashboardComponent implements OnInit {
  
  // Component properties
  imageLoaded = false;
  showOverlay = true;
  showFooter = true;
  imageWidth = 355;
  imageHeight = 255;
  
  constructor() { }

  ngOnInit(): void {
    // Initialize component and mark as loaded
    this.imageLoaded = true;
  }

  onImageLoad(event: Event): void {
    this.imageLoaded = true;
    const img = event.target as HTMLImageElement;
    console.log('Image loaded successfully:', img.src);
  }

  onImageError(event: Event): void {
    this.imageLoaded = false;
    console.error('Failed to load image:', event);
  }

  toggleOverlay(): void {
    this.showOverlay = !this.showOverlay;
  }

  toggleFooter(): void {
    this.showFooter = !this.showFooter;
  }
}
