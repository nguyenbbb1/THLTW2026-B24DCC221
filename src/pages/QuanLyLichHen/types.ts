export interface WorkSlot {
  day: string;
  time: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; 
  category?: string;
  unit?: 'phút' | 'giờ' | 'buổi' | 'ngày';
  description?: string;
  serviceIdCustom?: string;
}

export interface Employee {
  id: string;
  name: string;
  workSchedule: string;
  maxCustomersPerDay: number;
  position?: string;
  phone?: string;
  workSlots?: WorkSlot[]; 
}

export interface Appointment {
  id: string;
  appIdCustom: string;
  customerName: string;
  customerPhone?: string;
  employeeId: string;
  serviceId: string;
  dates: string[];
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  rating?: number;
  comment?: string;
  reply?: string;
  createdAt: string;
}