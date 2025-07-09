export interface Task {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  targetDate: string;
  status: 'P' | 'C'; // P = Pending, C = Completed
}
