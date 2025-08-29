export interface Dashboard {
  id: number;
  name: string;
  components: Array<{
    component_type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    series_type: string[];
  }>;
}