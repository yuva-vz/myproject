import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { Thumbnail } from './thumbnail.class';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-thumbnail-dashboard',
  templateUrl: './thumbnail-dashboard.component.html',
  styleUrls: ['./thumbnail-dashboard.component.scss']
})
export class ThumbnailDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('thumbnailContainer', { static: false }) thumbnailRef!: ElementRef<HTMLDivElement>;
   componentsData: any[] = [];
  
  private thumbnail!: Thumbnail;

  // Default components data
  defaultComponentsData: any[] = [
     {
            x: 0,
            y: 0,
            width: 20,
            height: 15,
            component_type: "CHART",
            series_type: ["BarSeries", "LineSeries", "PieSeries"],
        },
        {
            x: 20,
            y: 0,
            width: 12,
            height: 10,
            component_type: "GEOMAP",
            series_type: ["SpatialPolygonSeries"],
        },
        {
            x: 32,
            y: 0,
            width: 28,
            height: 15,
            component_type: "GRID",
            series_type: ["TableColumnSeries","TableRowSeries"],
        },
        {
            x: 0,
            y: 15,
            width: 10,
            height: 8,
            component_type: "PIVOT",
            series_type: ["TableColumnSeries","TableRowSeries"],
        },
        {
            x: 10,
            y: 15,
            width: 15,
            height: 12,
            component_type: "CARD",
            series_type: ["ValueSeries"],
        },
        {
            x: 25,
            y: 15,
            width: 15,
            height: 10,
            component_type: "SPATIALMAP",
            series_type: ["SpatialLineSeries", "HeatMapSeries"],
        },
        {
            x: 40,
            y: 15,
            width: 8,
            height: 5,
            component_type: "text",
            series_type: ["TextSeries"],
        },
        {
            x: 0,
            y: 27,
            width: 12,
            height: 8,
            component_type: "filter",
            series_type: ["FilterSeries", ""],
        },
        {
            x: 12,
            y: 27,
            width: 6,
            height: 4,
            component_type: "image",
            series_type: ["BubbleSeries"],
        },
        {
            x: 18,
            y: 27,
            width: 8,
            height: 5,
            component_type: "button",
            series_type: ["TooltipSeries", "TrendDifferenceSeries"],
        },
    ];

  ngAfterViewInit(): void {
    // Use provided data or default data
    const dataToUse = this.componentsData.length > 0 ? this.componentsData : this.defaultComponentsData;
    
    // Initialize thumbnail
    if (this.thumbnailRef) {
      this.thumbnail = new Thumbnail(this.thumbnailRef, dataToUse);
    }
  }

  ngOnDestroy(): void {
    // Clean up thumbnail instance
    if (this.thumbnail) {
      this.thumbnail.destroy();
    }
  }

  // Method to update thumbnail data
  updateThumbnailData(newData: any[]): void {
    this.componentsData = newData;
    if (this.thumbnail) {
      this.thumbnail.destroy();
      this.thumbnail = new Thumbnail(this.thumbnailRef, newData);
    }
  }

  // Method to manually refresh thumbnail
  refreshThumbnail(): void {
    if (this.thumbnail) {
      this.thumbnail.render();
    }
  }
}
function ngOnDestroy() {
  throw new Error('Function not implemented.');
}

