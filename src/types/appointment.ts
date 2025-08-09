
export interface FixedAppointment {
  id: string;
  adminId: string;
  adminName: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  status: 'available' | 'booked' | 'expired' | 'unavailable';
  assignedUserId?: string;
  assignedUserName?: string;
  assignedUserEmail?: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserAppointment {
  id: string;
  appointmentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  adminName: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  note?: string;
  requestedAt: string;
  confirmedAt?: string;
}

export interface AppointmentRequest {
  appointmentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  note?: string;
}

// Legacy types kept for backward compatibility
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedBy?: string;
  bookedByName?: string;
  note?: string;
}

export interface AppointmentAvailability {
  id: string;
  adminId: string;
  adminName: string;
  date: string;
  slots: TimeSlot[];
  maxAppointmentsPerDay: number;
  duration: number; // in minutes
}

export interface BookedAppointment {
  id: string;
  adminId: string;
  adminName: string;
  learnerId: string;
  learnerName: string;
  date: string;
  startTime: string;
  endTime: string;
  note?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface AppointmentSettings {
  duration: number;
  maxPerDay: number;
  allowCancellation: boolean;
  requireNote: boolean;
}

// API response appointment interface
export interface UserAppointmentItem {
  id: number;
  userId: number;
  availableAppointmentSlotId: number;
  userCourseId: number | null;
  appointmentType: string;
  hoursConsumed: number;
  amountPaid: number;
  note: string | null;
  learnerPermitIssueDate: string | null;
  permitNumber: string | null;
  permitExpirationDate: string | null;
  drivingExperience: string | null;
  isLicenceFromAnotherCountry: boolean;
  status: string;
  createdAt: string;
  appointmentSlot: {
    id: number;
    instructorId: number;
    courseId: number;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    status: number;
    createdById: number;
    updatedById: number;
    createdAt: string;
    updatedAt: string;
    pricePerSlot: number;
  };
  userCourse: any;
}
