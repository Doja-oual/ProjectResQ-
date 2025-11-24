// ============================================
// ENUMS (as const objects for better TypeScript compatibility)
// ============================================

export const AmbulanceStatus = {
  AVAILABLE: 'AVAILABLE',
  BUSY: 'BUSY',
  MAINTENANCE: 'MAINTENANCE',
  OFFLINE: 'OFFLINE',
} as const;

export type AmbulanceStatus = typeof AmbulanceStatus[keyof typeof AmbulanceStatus];

export const IncidentStatus = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type IncidentStatus = typeof IncidentStatus[keyof typeof IncidentStatus];

export const IncidentSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export type IncidentSeverity = typeof IncidentSeverity[keyof typeof IncidentSeverity];

export const EquipmentType = {
  DEFIBRILLATOR: 'DEFIBRILLATOR',
  OXYGEN: 'OXYGEN',
  STRETCHER: 'STRETCHER',
  FIRST_AID_KIT: 'FIRST_AID_KIT',
  ECG: 'ECG',
  VENTILATOR: 'VENTILATOR',
} as const;

export type EquipmentType = typeof EquipmentType[keyof typeof EquipmentType];

export const CrewRole = {
  DRIVER: 'DRIVER',
  PARAMEDIC: 'PARAMEDIC',
  NURSE: 'NURSE',
  DOCTOR: 'DOCTOR',
} as const;

export type CrewRole = typeof CrewRole[keyof typeof CrewRole];

// ============================================
// INTERFACES
// ============================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: Coordinates;
}

export interface Equipment {
  id: string;
  type: EquipmentType;
  name: string;
  isOperational: boolean;
}

export interface CrewMember {
  id: string;
  firstName: string;
  lastName: string;
  role: CrewRole;
  phoneNumber: string;
  certificationLevel?: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  licensePlate: string;
  status: AmbulanceStatus;
  currentLocation: Coordinates;
  heading?: number;
  baseStation: string;
  equipment: Equipment[];
  crew: CrewMember[];
  lastUpdate: string;
}

export interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: 'M' | 'F' | 'OTHER';
  phoneNumber?: string;
  medicalNotes?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: Address;
  patient: Patient;
  assignedAmbulanceId?: string;
  createdAt: string;
  updatedAt?: string;
  assignedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  estimatedArrivalTime?: string;
  distance?: number;
  reportedBy: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'INCIDENT_CREATED' | 'AMBULANCE_ASSIGNED' | 'STATUS_CHANGED' | 'INCIDENT_COMPLETED';
  incidentId?: string;
  ambulanceId?: string;
  description: string;
  userId?: string;
}

export interface KPI {
  availableAmbulances: number;
  activeIncidents: number;
  averageResponseTime: number;
  completedToday: number;
  criticalIncidents: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================
// FORM TYPES
// ============================================

export interface CreateIncidentForm {
  title: string;
  description: string;
  severity: IncidentSeverity;
  location: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  patient: {
    firstName: string;
    lastName: string;
    age?: number;
    gender?: 'M' | 'F' | 'OTHER';
    phoneNumber?: string;
    medicalNotes?: string;
  };
  reportedBy: string;
}

export interface UpdateAmbulanceStatusForm {
  status: AmbulanceStatus;
  notes?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface FilterOptions {
  status?: AmbulanceStatus[];
  severity?: IncidentSeverity[];
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}
