export interface Duty {
  id: string;
  title: string;
  description: string;
  location: string;
  status: 'assigned' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  route: string;
  icon: string;
  shift?: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationTime: string;
  status: 'registered' | 'checked-in' | 'scanned';
  qrCode?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedDuty: Duty | null;
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface ScanResult {
  participantId: string;
  participantName: string;
  scanTime: string;
  status: 'success' | 'error';
  message?: string;
} 