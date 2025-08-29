// thumbnail-dashboard.component.ts
import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Thumbnail } from './thumbnail.class';

@Component({
  selector: 'app-thumbnail-dashboard',
  templateUrl: './thumbnail-dashboard.component.html',
  styleUrls: ['./thumbnail-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ThumbnailDashboardComponent implements AfterViewInit, OnDestroy {
  @Input() dashboardId: any;
  @ViewChildren('thumbnailContainer') thumbnailRefs!: QueryList<ElementRef<HTMLDivElement>>;
  
  selectedDashboard: any = null;
  thumbnails: Map<number, Thumbnail> = new Map();

  // 20 Dashboard JSON Data Arrays
  // defaultComponentsData: any[] = [
  //   // Dashboard 1 - Sales Overview
  //   {
  //     id: 1,
  //     name: "Sales Overview",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 30, height: 22, series_type: ["ColumnSeries"] },
  //       { component_type: "chart", x: 30, y: 0, width: 30, height: 22, series_type: ["PieSeries"] },
  //       { component_type: "card", x: 0, y: 60, width: 20, height: 22, series_type: ["ValueSeries"] },
  //       { component_type: "chart", x: 20, y: 22, width: 22, height: 22, series_type: ["LineSeries"] }
  //     ]
  //   },

  //   // Dashboard 2 - Financial Analytics
  //   {
  //     id: 2,
  //     name: "Financial Analytics",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 20, height: 22, series_type: ["BarSeries"] },
  //       { component_type: "chart", x: 20, y: 0, width: 20, height: 22, series_type: ["AreaSeries"] },
  //       { component_type: "chart", x: 40, y: 0, width: 20, height: 22, series_type: ["DonutSeries"] },
  //       { component_type: "chart", x: 0, y: 30, width: 30, height: 30, series_type: ["WaterFallSeries"] },
  //       { component_type: "chart", x: 30, y: 22, width: 30, height: 22, series_type: ["GaugeSeries"] }
  //     ]
  //   },

  //   // Dashboard 3 - Marketing Metrics
  //   {
  //     id: 3,
  //     name: "Marketing Metrics",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 40, height: 30, series_type: ["ClusterBarSeries"] },
  //       { component_type: "card", x: 40, y: 0, width: 20, height: 15, series_type: ["ValueSeries"] },
  //       { component_type: "filter", x: 40, y: 15, width: 20, height: 15, series_type: ["DropdownSeries"] },
  //       { component_type: "chart", x: 0, y: 30, width: 60, height: 14, series_type: ["TreeMapSeries"] }
  //     ]
  //   },

  //   // Dashboard 4 - Operations Dashboard
  //   {
  //     id: 4,
  //     name: "Operations Dashboard",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 15, height: 15, series_type: ["RadarLine"] },
  //       { component_type: "chart", x: 15, y: 0, width: 15, height: 15, series_type: ["ScatterSeries"] },
  //       { component_type: "chart", x: 30, y: 0, width: 15, height: 15, series_type: ["BubbleSeries"] },
  //       { component_type: "chart", x: 45, y: 0, width: 15, height: 15, series_type: ["FunnelSeries"] },
  //       { component_type: "chart", x: 0, y: 15, width: 60, height: 29, series_type: ["CombinationChart"] }
  //     ]
  //   },

  //   // Dashboard 5 - Geographic Analysis
  //   {
  //     id: 5,
  //     name: "Geographic Analysis",
  //     components: [
  //       { component_type: "geomap", x: 0, y: 0, width: 40, height: 35, series_type: ["GeoMapSeries"] },
  //       { component_type: "card", x: 40, y: 0, width: 20, height: 12, series_type: ["ValueSeries"] },
  //       { component_type: "chart", x: 40, y: 12, width: 20, height: 11, series_type: ["ColumnSeries"] },
  //       { component_type: "text", x: 40, y: 23, width: 20, height: 12, series_type: ["TextSeries"] },
  //       { component_type: "chart", x: 0, y: 35, width: 60, height: 9, series_type: ["StackedColumnSeries"] }
  //     ]
  //   },

  //   // Dashboard 6 - Performance Tracker
  //   {
  //     id: 6,
  //     name: "Performance Tracker",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 20, height: 22, series_type: ["ClusterLineSeries"] },
  //       { component_type: "chart", x: 20, y: 0, width: 20, height: 22, series_type: ["ClusterAreaSeries"] },
  //       { component_type: "chart", x: 40, y: 0, width: 20, height: 22, series_type: ["StackedBarSeries"] },
  //       { component_type: "pivot", x: 0, y: 22, width: 40, height: 22, series_type: ["PivotRowSeries"] },
  //       { component_type: "chart", x: 40, y: 22, width: 20, height: 22, series_type: ["GaugeSeries"] }
  //     ]
  //   },

  //   // Dashboard 7 - Customer Insights
  //   {
  //     id: 7,
  //     name: "Customer Insights",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 30, height: 22, series_type: ["RadarArea"] },
  //       { component_type: "chart", x: 30, y: 0, width: 30, height: 22, series_type: ["ClusterLineRadar"] },
  //       { component_type: "chart", x: 0, y: 22, width: 30, height: 22, series_type: ["RadialSeries"] },
  //       { component_type: "chart", x: 30, y: 22, width: 30, height: 22, series_type: ["RadialStackedChart"] }
  //     ]
  //   },

  //   // Dashboard 8 - Spatial Data View
  //   {
  //     id: 8,
  //     name: "Spatial Data View",
  //     components: [
  //       { component_type: "spatialmap", x: 0, y: 0, width: 45, height: 35, series_type: ["SpatialMapBubbleSeries"] },
  //       { component_type: "filter", x: 45, y: 0, width: 15, height: 12, series_type: ["ButtonSeries"] },
  //       { component_type: "card", x: 45, y: 12, width: 15, height: 11, series_type: ["ValueSeries"] },
  //       { component_type: "card", x: 45, y: 23, width: 15, height: 12, series_type: ["ValueSeries"] },
  //       { component_type: "grid", x: 0, y: 35, width: 60, height: 9, series_type: ["TableRowSeries"] }
  //     ]
  //   },

  //   // Dashboard 9 - Radar Analysis
  //   {
  //     id: 9,
  //     name: "Radar Analysis",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 20, height: 22, series_type: ["RadarColumn"] },
  //       { component_type: "chart", x: 20, y: 0, width: 20, height: 22, series_type: ["RadarColumnStacked"] },
  //       { component_type: "chart", x: 40, y: 0, width: 20, height: 22, series_type: ["RadarColumnCluster"] },
  //       { component_type: "chart", x: 0, y: 22, width: 60, height: 22, series_type: ["ClusterAreaRadar"] }
  //     ]
  //   },

  //   // Dashboard 10 - Mixed Analytics
  //   {
  //     id: 10,
  //     name: "Mixed Analytics",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 40, height: 25, series_type: ["StackedCombinationChart"] },
  //       { component_type: "chart", x: 40, y: 0, width: 20, height: 12, series_type: ["PieSeries"] },
  //       { component_type: "chart", x: 40, y: 12, width: 20, height: 13, series_type: ["DonutSeries"] },
  //       { component_type: "text", x: 0, y: 25, width: 30, height: 19, series_type: ["TextSeries"] },
  //       { component_type: "filter", x: 30, y: 25, width: 30, height: 19, series_type: ["DropdownSeries"] }
  //     ]
  //   },

  //   // Dashboard 11 - Heat Map Dashboard
  //   {
  //     id: 11,
  //     name: "Heat Map Dashboard",
  //     components: [
  //       { component_type: "geomap", x: 0, y: 0, width: 40, height: 30, series_type: ["HeatMapSeries"] },
  //       { component_type: "chart", x: 40, y: 0, width: 20, height: 15, series_type: ["TreeMapSeries"] },
  //       { component_type: "chart", x: 40, y: 15, width: 20, height: 15, series_type: ["BubbleSeries"] },
  //       { component_type: "chart", x: 0, y: 30, width: 60, height: 14, series_type: ["WaterFallSeries"] }
  //     ]
  //   },

  //   // Dashboard 12 - Choropleth View
  //   {
  //     id: 12,
  //     name: "Choropleth View",
  //     components: [
  //       { component_type: "geomap", x: 0, y: 0, width: 45, height: 35, series_type: ["ChoroplethSeries"] },
  //       { component_type: "card", x: 45, y: 0, width: 15, height: 8, series_type: ["ValueSeries"] },
  //       { component_type: "card", x: 45, y: 8, width: 15, height: 8, series_type: ["ValueSeries"] },
  //       { component_type: "card", x: 45, y: 16, width: 15, height: 8, series_type: ["ValueSeries"] },
  //       { component_type: "card", x: 45, y: 24, width: 15, height: 11, series_type: ["ValueSeries"] },
  //       { component_type: "pivot", x: 0, y: 35, width: 60, height: 9, series_type: ["PivotColumnSeries"] }
  //     ]
  //   },

  //   // Dashboard 13 - Bubble Map Analysis
  //   {
  //     id: 13,
  //     name: "Bubble Map Analysis",
  //     components: [
  //       { component_type: "geomap", x: 0, y: 0, width: 30, height: 25, series_type: ["GeomapBubbleSeries"] },
  //       { component_type: "chart", x: 30, y: 0, width: 30, height: 25, series_type: ["ScatterSeries"] },
  //       { component_type: "chart", x: 0, y: 25, width: 20, height: 19, series_type: ["LineSeries"] },
  //       { component_type: "chart", x: 20, y: 25, width: 20, height: 19, series_type: ["AreaSeries"] },
  //       { component_type: "chart", x: 40, y: 25, width: 20, height: 19, series_type: ["ColumnSeries"] }
  //     ]
  //   },

  //   // Dashboard 14 - Spatial Polygon View
  //   {
  //     id: 14,
  //     name: "Spatial Polygon View",
  //     components: [
  //       { component_type: "spatialmap", x: 0, y: 0, width: 40, height: 30, series_type: ["SpatialPolygonSeries"] },
  //       { component_type: "filter", x: 40, y: 0, width: 20, height: 10, series_type: ["DropdownSeries"] },
  //       { component_type: "text", x: 40, y: 10, width: 20, height: 10, series_type: ["TextSeries"] },
  //       { component_type: "chart", x: 40, y: 20, width: 20, height: 10, series_type: ["FunnelSeries"] },
  //       { component_type: "grid", x: 0, y: 30, width: 60, height: 14, series_type: ["TableColumnSeries"] }
  //     ]
  //   },

  //   // Dashboard 15 - Multi-Chart Grid
  //   {
  //     id: 15,
  //     name: "Multi-Chart Grid",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 15, height: 11, series_type: ["ColumnSeries"] },
  //       { component_type: "chart", x: 15, y: 0, width: 15, height: 11, series_type: ["BarSeries"] },
  //       { component_type: "chart", x: 30, y: 0, width: 15, height: 11, series_type: ["LineSeries"] },
  //       { component_type: "chart", x: 45, y: 0, width: 15, height: 11, series_type: ["AreaSeries"] },
  //       { component_type: "chart", x: 0, y: 11, width: 15, height: 11, series_type: ["PieSeries"] },
  //       { component_type: "chart", x: 15, y: 11, width: 15, height: 11, series_type: ["DonutSeries"] },
  //       { component_type: "chart", x: 30, y: 11, width: 15, height: 11, series_type: ["RadarLine"] },
  //       { component_type: "chart", x: 45, y: 11, width: 15, height: 11, series_type: ["RadarArea"] },
  //       { component_type: "chart", x: 0, y: 22, width: 60, height: 22, series_type: ["CombinationChart"] }
  //     ]
  //   },

  //   // Dashboard 16 - Stacked Analysis
  //   {
  //     id: 16,
  //     name: "Stacked Analysis",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 30, height: 22, series_type: ["StackedColumnSeries"] },
  //       { component_type: "chart", x: 30, y: 0, width: 30, height: 22, series_type: ["StackedBarSeries"] },
  //       { component_type: "chart", x: 0, y: 22, width: 60, height: 22, series_type: ["StackedCombinationChart"] }
  //     ]
  //   },

  //   // Dashboard 17 - Cluster Comparison
  //   {
  //     id: 17,
  //     name: "Cluster Comparison",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 20, height: 15, series_type: ["ClusterBarSeries"] },
  //       { component_type: "chart", x: 20, y: 0, width: 20, height: 15, series_type: ["ClusterLineSeries"] },
  //       { component_type: "chart", x: 40, y: 0, width: 20, height: 15, series_type: ["ClusterAreaSeries"] },
  //       { component_type: "chart", x: 0, y: 15, width: 20, height: 15, series_type: ["ClusterLineRadar"] },
  //       { component_type: "chart", x: 20, y: 15, width: 20, height: 15, series_type: ["ClusterAreaRadar"] },
  //       { component_type: "chart", x: 40, y: 15, width: 20, height: 15, series_type: ["RadarColumnCluster"] },
  //       { component_type: "chart", x: 0, y: 30, width: 60, height: 14, series_type: ["RadialStackedChart"] }
  //     ]
  //   },

  //   // Dashboard 18 - Gauge Dashboard
  //   {
  //     id: 18,
  //     name: "Gauge Dashboard",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 20, height: 22, series_type: ["GaugeSeries"] },
  //       { component_type: "chart", x: 20, y: 0, width: 20, height: 22, series_type: ["GaugeSeries"] },
  //       { component_type: "chart", x: 40, y: 0, width: 20, height: 22, series_type: ["GaugeSeries"] },
  //       { component_type: "pivot", x: 0, y: 22, width: 60, height: 22, series_type: ["PivotRowSeries"] }
  //     ]
  //   },

  //   // Dashboard 19 - Funnel Analytics
  //   {
  //     id: 19,
  //     name: "Funnel Analytics",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 30, height: 30, series_type: ["FunnelSeries"] },
  //       { component_type: "chart", x: 30, y: 0, width: 30, height: 30, series_type: ["WaterFallSeries"] },
  //       { component_type: "card", x: 0, y: 30, width: 15, height: 14, series_type: ["ValueSeries"] },
  //       { component_type: "card", x: 15, y: 30, width: 15, height: 14, series_type: ["ValueSeries"] },
  //       { component_type: "card", x: 30, y: 30, width: 15, height: 14, series_type: ["ValueSeries"] },
  //       { component_type: "card", x: 45, y: 30, width: 15, height: 14, series_type: ["ValueSeries"] }
  //     ]
  //   },

  //   // Dashboard 20 - Tree & Bubble View
  //   {
  //     id: 20,
  //     name: "Tree & Bubble View",
  //     components: [
  //       { component_type: "chart", x: 0, y: 0, width: 30, height: 25, series_type: ["TreeMapSeries"] },
  //       { component_type: "chart", x: 30, y: 0, width: 30, height: 25, series_type: ["BubbleSeries"] },
  //       { component_type: "text", x: 0, y: 25, width: 60, height: 8, series_type: ["TextSeries"] },
  //       { component_type: "filter", x: 0, y: 33, width: 60, height: 11, series_type: ["ButtonSeries"] }
  //     ]
  //   }
  // ];
// defaultComponentsData: any[] = [
//   // Dashboard 1 - Sales Overview
//   {
//     id: 1,
//     name: "Sales Overview",
//     components: [
//       { component_type: "chart", x: 0,  y: 0,  width: 30, height: 20, series_type: ["ColumnSeries"] },
//       { component_type: "chart", x: 30, y: 0,  width: 30, height: 20, series_type: ["PieSeries"] },
//       { component_type: "card",  x: 45,  y: 59, width: 20, height: 20, series_type: ["ValueSeries"] },
//       { component_type: "chart", x: 20, y: 58, width: 40, height: 20, series_type: ["LineSeries"] }
//     ]
//   },

//   // Dashboard 2 - Financial Analytics
//   {
//     id: 2,
//     name: "Financial Analytics",
//     components: [
//       { component_type: "chart", x: 0,  y: 0,  width: 20, height: 20, series_type: ["BarSeries"] },
//       { component_type: "chart", x: 20, y: 0,  width: 20, height: 20, series_type: ["AreaSeries"] },
//       { component_type: "chart", x: 40, y: 0,  width: 20, height: 20, series_type: ["DonutSeries"] },
//       { component_type: "chart", x: 0,  y: 20, width: 30, height: 20, series_type: ["WaterFallSeries"] },
//       { component_type: "chart", x: 30, y: 20, width: 30, height: 20, series_type: ["GaugeSeries"] }
//     ]
//   },

//   // Dashboard 3 - Marketing Metrics
//   {
//     id: 3,
//     name: "Marketing Metrics",
//     components: [
//       { component_type: "chart", x: 0,  y: 0,  width: 40, height: 20, series_type: ["ClusterBarSeries"] },
//       { component_type: "card",  x: 40, y: 0,  width: 20, height: 10, series_type: ["ValueSeries"] },
//       { component_type: "filter",x: 40, y: 10, width: 20, height: 10, series_type: ["DropdownSeries"] },
//       { component_type: "chart", x: 0,  y: 20, width: 60, height: 20, series_type: ["TreeMapSeries"] }
//     ]
//   },

//   // Dashboard 4 - Operations Dashboard
//   {
//     id: 4,
//     name: "Operations Dashboard",
//     components: [
//       { component_type: "chart", x: 0,  y: 0,  width: 15, height: 20, series_type: ["RadarLine"] },
//       { component_type: "chart", x: 15, y: 0,  width: 15, height: 20, series_type: ["ScatterSeries"] },
//       { component_type: "chart", x: 30, y: 0,  width: 15, height: 20, series_type: ["BubbleSeries"] },
//       { component_type: "chart", x: 45, y: 0,  width: 15, height: 20, series_type: ["FunnelSeries"] },
//       { component_type: "chart", x: 0,  y: 20, width: 60, height: 20, series_type: ["CombinationChart"] }
//     ]
//   },

//   // Dashboard 5 - Geographic Analysis
//   {
//     id: 5,
//     name: "Geographic Analysis",
//     components: [
//       { component_type: "geomap", x: 0,  y: 0,  width: 40, height: 20, series_type: ["GeoMapSeries"] },
//       { component_type: "card",  x: 40, y: 0,  width: 20, height: 10, series_type: ["ValueSeries"] },
//       { component_type: "chart", x: 40, y: 10, width: 20, height: 10, series_type: ["ColumnSeries"] },
//       { component_type: "text",  x: 40, y: 20, width: 20, height: 20, series_type: ["TextSeries"] },
//       { component_type: "chart", x: 0,  y: 20, width: 40, height: 20, series_type: ["StackedColumnSeries"] }
//     ]
//   },

//   // Dashboard 6 - Performance Tracker
//   {
//     id: 6,
//     name: "Performance Tracker",
//     components: [
//       { component_type: "chart", x: 0,  y: 0,  width: 20, height: 20, series_type: ["ClusterLineSeries"] },
//       { component_type: "chart", x: 20, y: 0,  width: 20, height: 20, series_type: ["ClusterAreaSeries"] },
//       { component_type: "chart", x: 40, y: 0,  width: 20, height: 20, series_type: ["StackedBarSeries"] },
//       { component_type: "pivot", x: 0,  y: 20, width: 40, height: 20, series_type: ["PivotRowSeries"] },
//       { component_type: "chart", x: 40, y: 20, width: 20, height: 20, series_type: ["GaugeSeries"] }
//     ]
//   },

//   // Dashboard 7 - Customer Insights
//   {
//     id: 7,
//     name: "Customer Insights",
//     components: [
//       { component_type: "chart", x: 0,  y: 0,  width: 30, height: 20, series_type: ["RadarArea"] },
//       { component_type: "chart", x: 30, y: 0,  width: 30, height: 20, series_type: ["ClusterLineRadar"] },
//       { component_type: "chart", x: 0,  y: 20, width: 30, height: 20, series_type: ["RadialSeries"] },
//       { component_type: "chart", x: 30, y: 20, width: 30, height: 20, series_type: ["RadialStackedChart"] }
//     ]
//   },

//   // Dashboard 8 - Spatial Data View
//   {
//     id: 8,
//     name: "Spatial Data View",
//     components: [
//       { component_type: "spatialmap", x: 0,  y: 0,  width: 45, height: 20, series_type: ["SpatialMapBubbleSeries"] },
//       { component_type: "filter",    x: 45, y: 0,  width: 15, height: 10, series_type: ["ButtonSeries"] },
//       { component_type: "card",      x: 45, y: 10, width: 15, height: 10, series_type: ["ValueSeries"] },
//       { component_type: "card",      x: 45, y: 20, width: 15, height: 10, series_type: ["ValueSeries"] },
//       { component_type: "grid",      x: 0,  y: 20, width: 45, height: 20, series_type: ["TableRowSeries"] }
//     ]
//   },

//   // Dashboard 9 - Radar Analysis
//   {
//     id: 9,
//     name: "Radar Analysis",
//     components: [
//       { component_type: "chart", x: 0,  y: 0,  width: 20, height: 20, series_type: ["RadarColumn"] },
//       { component_type: "chart", x: 20, y: 0,  width: 20, height: 20, series_type: ["RadarColumnStacked"] },
//       { component_type: "chart", x: 40, y: 0,  width: 20, height: 20, series_type: ["RadarColumnCluster"] },
//       { component_type: "chart", x: 0,  y: 20, width: 60, height: 20, series_type: ["ClusterAreaRadar"] }
//     ]
//   },

//   // Dashboard 10 - Mixed Analytics
//   {
//     id: 10,
//     name: "Mixed Analytics",
//     components: [
//       { component_type: "chart",  x: 0,  y: 0,  width: 40, height: 20, series_type: ["StackedCombinationChart"] },
//       { component_type: "chart",  x: 40, y: 0,  width: 20, height: 10, series_type: ["PieSeries"] },
//       { component_type: "chart",  x: 40, y: 10, width: 20, height: 10, series_type: ["DonutSeries"] },
//       { component_type: "text",   x: 0,  y: 20, width: 30, height: 20, series_type: ["TextSeries"] },
//       { component_type: "filter", x: 30, y: 20, width: 30, height: 20, series_type: ["DropdownSeries"] }
//     ]
//   },

//   // Dashboard 11 - Heat Map Dashboard
//   {
//     id: 11,
//     name: "Heat Map Dashboard",
//     components: [
//       { component_type: "geomap", x: 0,  y: 0,  width: 40, height: 20, series_type: ["HeatMapSeries"] },
//       { component_type: "chart",  x: 40, y: 0,  width: 20, height: 10, series_type: ["TreeMapSeries"] },
//       { component_type: "chart",  x: 40, y: 10, width: 20, height: 10, series_type: ["BubbleSeries"] },
//       { component_type: "chart",  x: 0,  y: 20, width: 60, height: 20, series_type: ["WaterFallSeries"] }
//     ]
//   },

//   // Dashboard 12 - Choropleth View
//   {
//     id: 12,
//     name: "Choropleth View",
//     components: [
//       { component_type: "geomap", x: 0,  y: 0,  width: 45, height: 20, series_type: ["ChoroplethSeries"] },
//       { component_type: "card",   x: 45, y: 0,  width: 15, height: 5, series_type: ["ValueSeries"] },
//       { component_type: "card",   x: 45, y: 5,  width: 15, height: 5, series_type: ["ValueSeries"] },
//       { component_type: "card",   x: 45, y: 10, width: 15, height: 5, series_type: ["ValueSeries"] },
//       { component_type: "card",   x: 45, y: 15, width: 15, height: 5, series_type: ["ValueSeries"] },
//       { component_type: "pivot",  x: 0,  y: 20, width: 60, height: 20, series_type: ["PivotColumnSeries"] }
//     ]
//   },
// ]

defaultComponentsData: any[] = [
  // Dashboard 1 - Basic Charts Overview (60x40 grid)
  {
    id: 1,
    name: "Basic Charts Overview",
    components: [
      { component_type: "filter", x: 0,  y: 10,  width: 20, height: 20, series_type: [""] },
      { component_type: "chart", x: 20, y: 10,  width: 20, height: 20, series_type: ["RadialSeries"] },
      { component_type: "chart", x: 40, y: 10,  width: 20, height: 20, series_type: ["ColumnSeries"] },
      { component_type: "chart", x: 0,  y: 30, width: 20, height: 20, series_type: ["BarSeries"] },
      { component_type: "chart", x: 20, y: 70, width: 20, height: 20, series_type: ["PieSeries"] },
      { component_type: "chart", x: 40, y: 65, width: 20, height: 20, series_type: ["DonutSeries"] }
    ]
  },

  // Dashboard 2 - Cluster & Stacked Charts (60x40 grid)
  {
    id: 2,
    name: "Cluster & Stacked Charts",
    components: [
      { component_type: "chart", x: 0,  y: 0,  width: 30, height: 20, series_type: ["ClusterLineSeries"] },
      { component_type: "chart", x: 30, y: 0,  width: 30, height: 20, series_type: ["ClusterAreaSeries"] },
      { component_type: "chart", x: 0,  y: 20, width: 20, height: 20, series_type: ["ClusterBarSeries"] },
      { component_type: "chart", x: 20, y: 20, width: 20, height: 20, series_type: ["StackedColumnSeries"] },
      { component_type: "filter", x: 40, y: 55, width: 20, height: 20, series_type: ["TextSeries"] }
    ]
  },

  // Dashboard 3 - Radar & Radial Charts (60x40 grid)
  {
    id: 3,
    name: "Radar & Radial Charts",
    components: [
      { component_type: "chart", x: 0,  y: 0,  width: 15, height: 20, series_type: ["RadarLine"] },
      { component_type: "chart", x: 15, y: 0,  width: 15, height: 20, series_type: ["RadarArea"] },
      { component_type: "chart", x: 30, y: 0,  width: 15, height: 20, series_type: ["ClusterLineRadar"] },
 
      { component_type: "chart", x: 45, y: 0,  width: 15, height: 20, series_type: ["ClusterAreaRadar"] },
     
    ]
  },

  // Dashboard 4 - Radar Column Variations (60x40 grid)
  {
    id: 4,
    name: "Radar Column Variations",
    components: [
      { component_type: "chart", x: 0,  y: 0,  width: 20, height: 20, series_type: ["RadarColumn"] },
      { component_type: "chart", x: 20, y: 0,  width: 20, height: 20, series_type: ["RadialStackedChart"] },
      { component_type: "chart", x: 40, y: 0,  width: 20, height: 20, series_type: ["RadarColumnCluster"] },
      { component_type: "chart", x: 0,  y: 20, width: 60, height: 20, series_type: ["CombinationChart"] },
       { component_type: "chart", x: 0,  y: 60, width: 30, height: 20, series_type: ["RadialSeries"] },
    ]
  },

  // Dashboard 5 - Specialty Charts (60x40 grid)
  {
    id: 5,
    name: "Specialty Charts",
    components: [
     
      { component_type: "text", x: 20, y: 0,  width: 20, height: 20, series_type: ["TextSeries"] },
      { component_type: "chart", x: 40, y: 0,  width: 20, height: 20, series_type: ["TreeMapSeries"] },
      { component_type: "chart", x: 0,  y: 20, width: 20, height: 20, series_type: ["FunnelSeries"] },
      { component_type: "chart", x: 20, y: 20, width: 20, height: 20, series_type: ["WaterFallSeries"] },
      { component_type: "chart", x: 40, y: 20, width: 20, height: 20, series_type: ["GaugeSeries"] }
    ]
  },

  // Dashboard 6 - Combination Charts (60x40 grid)
  {
    id: 6,
    name: "Combination Charts",
    components: [
      { component_type: "chart", x: 0,  y: 0,  width: 60, height: 20, series_type: ["CombinationChart"] },
      { component_type: "chart", x: 0,  y: 20, width: 60, height: 20, series_type: ["StackedCombinationChart"] }
    ]
  },

  // Dashboard 7 - Geographic & Spatial (60x40 grid)
  {
    id: 7,
    name: "Geographic & Spatial",
    components: [
      { component_type: "geomap", x: 10,  y: 45,  width: 40, height: 25, series_type: ["GeoMapSeries"] },
      { component_type: "card",   x: 10, y: 59,  width: 20, height: 8, series_type: ["ValueSeries"] },
      { component_type: "card",   x: 30, y: 59,  width: 20, height: 8, series_type: ["ValueSeries"] },
      { component_type: "card",   x: 40, y: 59, width: 20, height: 9, series_type: ["ValueSeries"] },
      { component_type: "spatialmap", x: 0,  y: 25, width: 60, height: 15, series_type: ["SpatialMapBubbleSeries"] }
    ]
  },

  // Dashboard 8 - Heat Map & Choropleth (60x40 grid)
  {
    id: 8,
    name: "Heat Map & Choropleth",
    components: [
      { component_type: "geomap", x: 0,  y: 0,  width: 40, height: 20, series_type: ["HeatMapSeries"] },
      { component_type: "chart",  x: 40, y: 0,  width: 20, height: 10, series_type: ["TreeMapSeries"] },
      { component_type: "chart",  x: 40, y: 10, width: 20, height: 10, series_type: ["BubbleSeries"] },
      { component_type: "geomap", x: 0,  y: 20, width: 60, height: 20, series_type: ["ChoroplethSeries"] }
    ]
  },

  // Dashboard 9 - Data Tables & Grids (60x40 grid)
  {
    id: 9,
    name: "Data Tables & Grids",
    components: [
      { component_type: "grid",  x: 0,  y: 0,  width: 40, height: 20, series_type: ["TableRowSeries"] },
      { component_type: "card",  x: 40, y: 0,  width: 20, height: 10, series_type: ["ValueSeries"] },
      { component_type: "card",  x: 40, y: 10, width: 20, height: 10, series_type: ["ValueSeries"] },
      { component_type: "pivot", x: 0,  y: 20, width: 60, height: 20, series_type: ["PivotRowSeries"] }
    ]
  },

  // Dashboard 10 - Pivot Table Variations (60x40 grid)
  {
    id: 10,
    name: "Pivot Table Variations",
    components: [
      { component_type: "pivot", x: 0,  y: 0,  width: 60, height: 20, series_type: ["PivotRowSeries"] },
      { component_type: "pivot", x: 0,  y: 20, width: 60, height: 20, series_type: ["PivotColumnSeries"] }
    ]
  },

  // Dashboard 11 - Interactive Controls (60x40 grid)
  {
    id: 11,
    name: "Interactive Controls",
    components: [
      { component_type: "chart",  x: 0,  y: 0,  width: 40, height: 20, series_type: ["LineSeries"] },
      { component_type: "filter", x: 40, y: 0,  width: 20, height: 5, series_type: ["DropdownSeries"] },
      { component_type: "filter", x: 40, y: 5,  width: 20, height: 5, series_type: ["ButtonSeries"] },
      { component_type: "card",   x: 40, y: 10, width: 20, height: 10, series_type: ["ValueSeries"] },
      { component_type: "text",   x: 0,  y: 20, width: 30, height: 20, series_type: ["TextSeries"] },
      { component_type: "image",  x: 30, y: 20, width: 30, height: 20, series_type: ["ImageSeries"] }
    ]
  },

  // Dashboard 12 - Mixed Content Layout (60x40 grid)
  {
    id: 12,
    name: "Mixed Content Layout",
    components: [
      { component_type: "chart", x: 0,  y: 0,  width: 30, height: 15, series_type: ["ColumnSeries"] },
      { component_type: "chart", x: 30, y: 0,  width: 30, height: 15, series_type: ["PieSeries"] },
      { component_type: "card",  x: 0,  y: 15, width: 15, height: 10, series_type: ["ValueSeries"] },
      { component_type: "card",  x: 15, y: 15, width: 15, height: 10, series_type: ["ValueSeries"] },
      { component_type: "card",  x: 30, y: 15, width: 15, height: 10, series_type: ["ValueSeries"] },
      { component_type: "card",  x: 45, y: 15, width: 15, height: 10, series_type: ["ValueSeries"] },
      { component_type: "grid",  x: 0,  y: 25, width: 60, height: 15, series_type: ["TableRowSeries"] }
    ]
  },

  // Dashboard 13 - Executive Summary (60x40 grid)
  {
    id: 13,
    name: "Executive Summary",
    components: [
      { component_type: "card",  x: 0,  y: 0,  width: 12, height: 8, series_type: ["ValueSeries"] },
      { component_type: "card",  x: 12, y: 0,  width: 12, height: 8, series_type: ["ValueSeries"] },
      { component_type: "card",  x: 24, y: 0,  width: 12, height: 8, series_type: ["ValueSeries"] },
      { component_type: "card",  x: 36, y: 0,  width: 12, height: 8, series_type: ["ValueSeries"] },
      { component_type: "card",  x: 48, y: 0,  width: 12, height: 8, series_type: ["ValueSeries"] },
      { component_type: "chart", x: 0,  y: 8,  width: 30, height: 16, series_type: ["LineSeries"] },
      { component_type: "chart", x: 30, y: 8,  width: 30, height: 16, series_type: ["ColumnSeries"] },
      { component_type: "chart", x: 0,  y: 24, width: 60, height: 16, series_type: ["CombinationChart"] }
    ]
  },

  // Dashboard 14 - Operations Monitor (60x40 grid)
  {
    id: 14,
    name: "Operations Monitor",
    components: [
      { component_type: "chart", x: 0,  y: 0,  width: 20, height: 20, series_type: ["GaugeSeries"] },
      { component_type: "chart", x: 20, y: 0,  width: 20, height: 20, series_type: ["RadialSeries"] },
      { component_type: "chart", x: 40, y: 0,  width: 20, height: 20, series_type: ["WaterFallSeries"] },
      { component_type: "geomap", x: 0,  y: 20, width: 40, height: 20, series_type: ["HeatMapSeries"] },
      { component_type: "grid",   x: 40, y: 20, width: 20, height: 20, series_type: ["TableRowSeries"] }
    ]
  },

  // Dashboard 15 - Analytics Workbench (60x40 grid)
  {
    id: 15,
    name: "Analytics Workbench",
    components: [
      { component_type: "chart",  x: 0,  y: 0,  width: 20, height: 13, series_type: ["ScatterSeries"] },
      { component_type: "chart",  x: 20, y: 0,  width: 20, height: 13, series_type: ["BubbleSeries"] },
      { component_type: "chart",  x: 40, y: 0,  width: 20, height: 13, series_type: ["TreeMapSeries"] },
      { component_type: "filter", x: 0,  y: 13, width: 15, height: 7, series_type: ["DropdownSeries"] },
      { component_type: "filter", x: 15, y: 13, width: 15, height: 7, series_type: ["ButtonSeries"] },
      { component_type: "text",   x: 30, y: 13, width: 30, height: 7, series_type: ["TextSeries"] },
      { component_type: "pivot",  x: 0,  y: 20, width: 60, height: 20, series_type: ["PivotColumnSeries"] }
    ]
  }
];


  ngAfterViewInit(): void {
    // Initialize all thumbnails after view init
    setTimeout(() => {
      this.initializeThumbnails();
    }, 100);
  }

  private initializeThumbnails(): void {
    this.thumbnailRefs.forEach((ref, index) => {
      const dashboard = this.defaultComponentsData[index];
      if (ref && dashboard) {
        try {
          const thumbnail = new Thumbnail(ref, dashboard.components);
          this.thumbnails.set(dashboard.id, thumbnail);
          console.log(`Initialized thumbnail for dashboard ${dashboard.id}: ${dashboard.name}`);
        } catch (error) {
          console.error(`Failed to initialize thumbnail for dashboard ${dashboard.id}:`, error);
        }
      }
    });
  }

  selectDashboard(dashboard: any): void {
    this.selectedDashboard = this.selectedDashboard?.id === dashboard.id ? null : dashboard;
    console.log('Selected dashboard:', this.selectedDashboard);
  }

  ngOnDestroy(): void {
    // Clean up all thumbnail instances
    this.thumbnails.forEach(thumbnail => {
      if (thumbnail && typeof thumbnail.destroy === 'function') {
        thumbnail.destroy();
      }
    });
    this.thumbnails.clear();
  }

  // Method to refresh specific thumbnail
  // refreshThumbnail(dashboardId: number): void {
  //   const thumbnail = this.thumbnails.get(dashboardId);
  //   if (thumbnail && typeof thumbnail.render === 'function') {
  //     thumbnail.render();
  //   }
  // }

  // Method to refresh all thumbnails
  // refreshAllThumbnails(): void {
  //   this.thumbnails.forEach(thumbnail => {
  //     if (thumbnail && typeof thumbnail.render === 'function') {
  //       thumbnail.render();
  //     }
  //   });
  // }

  // Method to get dashboard by ID
  // getDashboardById(id: number): any {
  //   return this.defaultComponentsData.find(dashboard => dashboard.id === id);
  // }

  // Method to update dashboard data
  // updateDashboardData(id: number, newComponents: any[]): void {
  //   const dashboardIndex = this.defaultComponentsData.findIndex(d => d.id === id);
  //   if (dashboardIndex >= 0) {
  //     this.defaultComponentsData[dashboardIndex].components = newComponents;
      
  //     // Refresh the specific thumbnail
  //     const thumbnail = this.thumbnails.get(id);
  //     if (thumbnail) {
  //       thumbnail.destroy();
  //       const ref = this.thumbnailRefs.toArray()[dashboardIndex];
  //       if (ref) {
  //         const newThumbnail = new Thumbnail(ref, newComponents);
  //         this.thumbnails.set(id, newThumbnail);
  //       }
  //     }
  //   }
  }

  // Method to view/open a dashboard (you can customize this based on your routing)
  // viewDashboard(dashboard: any): void {
  //   console.log('Opening dashboard:', dashboard);
    // Add your navigation logic here
    // Example: this.router.navigate(['/dashboard', dashboard.id]);
    // Or emit an event: this.dashboardSelected.emit(dashboard);
  // }

  // Method to get component statistics
  // getComponentStats(): any {
  //   const stats = {
  //     totalComponents: 0,
  //     componentTypes: {} as any,
  //     seriesTypes: {} as any
  //   };

  //   this.defaultComponentsData.forEach(dashboard => {
  //     dashboard.components.forEach((comp: any) => {
  //       stats.totalComponents++;
        
  //       // Count component types
  //       if (stats.componentTypes[comp.component_type]) {
  //         stats.componentTypes[comp.component_type]++;
  //       } else {
  //         stats.componentTypes[comp.component_type] = 1;
  //       }

  //       // Count series types
  //       comp.series_type.forEach((series: string) => {
  //         if (stats.seriesTypes[series]) {
  //           stats.seriesTypes[series]++;
  //         } else {
  //           stats.seriesTypes[series] = 1;
  //         }
  //       });
  //     });
  //   });

//   return stats;
// }