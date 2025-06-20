
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppointmentAvailability, BookedAppointment, TimeSlot, FixedAppointment, UserAppointment, AppointmentRequest } from '@/types/appointment';

interface AppointmentContextType {
  // Legacy methods (kept for backward compatibility)
  availabilities: AppointmentAvailability[];
  bookedAppointments: BookedAppointment[];
  addAvailability: (availability: AppointmentAvailability) => void;
  updateAvailability: (id: string, availability: Partial<AppointmentAvailability>) => void;
  deleteAvailability: (id: string) => void;
  bookAppointment: (appointment: BookedAppointment) => void;
  cancelAppointment: (appointmentId: string) => void;
  getAdminAppointments: (adminId: string) => BookedAppointment[];
  getLearnerAppointments: (learnerId: string) => BookedAppointment[];
  getAvailableSlots: (adminId: string, date: string) => TimeSlot[];
  
  // New fixed appointment methods
  fixedAppointments: FixedAppointment[];
  userAppointments: UserAppointment[];
  createFixedAppointment: (appointment: Omit<FixedAppointment, 'id' | 'createdAt'>) => void;
  updateFixedAppointment: (id: string, updates: Partial<FixedAppointment>) => void;
  deleteFixedAppointment: (id: string) => void;
  requestAppointment: (request: AppointmentRequest) => void;
  confirmAppointment: (appointmentId: string, userId: string) => void;
  cancelUserAppointment: (appointmentId: string) => void;
  getAdminFixedAppointments: (adminId: string) => FixedAppointment[];
  getUserFixedAppointments: (userId: string) => UserAppointment[];
  getAvailableFixedAppointments: () => FixedAppointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  // Legacy state
  const [availabilities, setAvailabilities] = useState<AppointmentAvailability[]>([]);
  const [bookedAppointments, setBookedAppointments] = useState<BookedAppointment[]>([]);

  // New fixed appointment state
  const [fixedAppointments, setFixedAppointments] = useState<FixedAppointment[]>([
    {
      id: '1',
      adminId: 'admin1',
      adminName: 'Dr. Sarah Johnson',
      date: '2024-12-20',
      startTime: '10:00',
      endTime: '10:30',
      status: 'available',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      adminId: 'admin1',
      adminName: 'Dr. Sarah Johnson',
      date: '2024-12-21',
      startTime: '14:00',
      endTime: '14:30',
      status: 'booked',
      assignedUserId: 'user1',
      assignedUserName: 'John Doe',
      assignedUserEmail: 'john@example.com',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      adminId: 'admin1',
      adminName: 'Dr. Sarah Johnson',
      date: '2024-12-22',
      startTime: '09:00',
      endTime: '09:30',
      status: 'available',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [userAppointments, setUserAppointments] = useState<UserAppointment[]>([
    {
      id: '1',
      appointmentId: '2',
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      date: '2024-12-21',
      startTime: '14:00',
      endTime: '14:30',
      adminName: 'Dr. Sarah Johnson',
      status: 'confirmed',
      requestedAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
    },
  ]);

  // Legacy methods
  const addAvailability = (availability: AppointmentAvailability) => {
    setAvailabilities(prev => [...prev, availability]);
  };

  const updateAvailability = (id: string, updates: Partial<AppointmentAvailability>) => {
    setAvailabilities(prev => 
      prev.map(avail => avail.id === id ? { ...avail, ...updates } : avail)
    );
  };

  const deleteAvailability = (id: string) => {
    setAvailabilities(prev => prev.filter(avail => avail.id !== id));
  };

  const bookAppointment = (appointment: BookedAppointment) => {
    setBookedAppointments(prev => [...prev, appointment]);
    
    setAvailabilities(prev => 
      prev.map(avail => {
        if (avail.adminId === appointment.adminId && avail.date === appointment.date) {
          return {
            ...avail,
            slots: avail.slots.map(slot => 
              slot.startTime === appointment.startTime
                ? { ...slot, isBooked: true, bookedBy: appointment.learnerId, bookedByName: appointment.learnerName, note: appointment.note }
                : slot
            )
          };
        }
        return avail;
      })
    );
  };

  const cancelAppointment = (appointmentId: string) => {
    const appointment = bookedAppointments.find(app => app.id === appointmentId);
    if (appointment) {
      setBookedAppointments(prev => 
        prev.map(app => app.id === appointmentId ? { ...app, status: 'cancelled' } : app)
      );
      
      setAvailabilities(prev => 
        prev.map(avail => {
          if (avail.adminId === appointment.adminId && avail.date === appointment.date) {
            return {
              ...avail,
              slots: avail.slots.map(slot => 
                slot.startTime === appointment.startTime
                  ? { ...slot, isBooked: false, bookedBy: undefined, bookedByName: undefined, note: undefined }
                  : slot
              )
            };
          }
          return avail;
        })
      );
    }
  };

  const getAdminAppointments = (adminId: string) => {
    return bookedAppointments.filter(app => app.adminId === adminId);
  };

  const getLearnerAppointments = (learnerId: string) => {
    return bookedAppointments.filter(app => app.learnerId === learnerId);
  };

  const getAvailableSlots = (adminId: string, date: string) => {
    const availability = availabilities.find(avail => avail.adminId === adminId && avail.date === date);
    return availability ? availability.slots.filter(slot => !slot.isBooked) : [];
  };

  // New fixed appointment methods
  const createFixedAppointment = (appointment: Omit<FixedAppointment, 'id' | 'createdAt'>) => {
    const newAppointment: FixedAppointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setFixedAppointments(prev => [...prev, newAppointment]);
  };

  const updateFixedAppointment = (id: string, updates: Partial<FixedAppointment>) => {
    setFixedAppointments(prev =>
      prev.map(app => app.id === id ? { ...app, ...updates, updatedAt: new Date().toISOString() } : app)
    );
  };

  const deleteFixedAppointment = (id: string) => {
    setFixedAppointments(prev => prev.filter(app => app.id !== id));
    setUserAppointments(prev => prev.filter(app => app.appointmentId !== id));
  };

  const requestAppointment = (request: AppointmentRequest) => {
    const appointment = fixedAppointments.find(app => app.id === request.appointmentId);
    if (appointment && appointment.status === 'available') {
      // Update fixed appointment to booked
      updateFixedAppointment(appointment.id, {
        status: 'booked',
        assignedUserId: request.userId,
        assignedUserName: request.userName,
        assignedUserEmail: request.userEmail,
        note: request.note,
      });

      // Create user appointment
      const userAppointment: UserAppointment = {
        id: Date.now().toString(),
        appointmentId: request.appointmentId,
        userId: request.userId,
        userName: request.userName,
        userEmail: request.userEmail,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        adminName: appointment.adminName,
        status: 'confirmed',
        note: request.note,
        requestedAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
      };

      setUserAppointments(prev => [...prev, userAppointment]);
    }
  };

  const confirmAppointment = (appointmentId: string, userId: string) => {
    setUserAppointments(prev =>
      prev.map(app =>
        app.appointmentId === appointmentId && app.userId === userId
          ? { ...app, status: 'confirmed', confirmedAt: new Date().toISOString() }
          : app
      )
    );
  };

  const cancelUserAppointment = (appointmentId: string) => {
    const userAppointment = userAppointments.find(app => app.appointmentId === appointmentId);
    if (userAppointment) {
      // Mark user appointment as cancelled
      setUserAppointments(prev =>
        prev.map(app => app.appointmentId === appointmentId ? { ...app, status: 'cancelled' } : app)
      );

      // Make fixed appointment available again
      updateFixedAppointment(appointmentId, {
        status: 'available',
        assignedUserId: undefined,
        assignedUserName: undefined,
        assignedUserEmail: undefined,
        note: undefined,
      });
    }
  };

  const getAdminFixedAppointments = (adminId: string) => {
    return fixedAppointments.filter(app => app.adminId === adminId);
  };

  const getUserFixedAppointments = (userId: string) => {
    return userAppointments.filter(app => app.userId === userId);
  };

  const getAvailableFixedAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return fixedAppointments.filter(app => app.status === 'available' && app.date >= today);
  };

  return (
    <AppointmentContext.Provider value={{
      // Legacy methods
      availabilities,
      bookedAppointments,
      addAvailability,
      updateAvailability,
      deleteAvailability,
      bookAppointment,
      cancelAppointment,
      getAdminAppointments,
      getLearnerAppointments,
      getAvailableSlots,
      
      // New fixed appointment methods
      fixedAppointments,
      userAppointments,
      createFixedAppointment,
      updateFixedAppointment,
      deleteFixedAppointment,
      requestAppointment,
      confirmAppointment,
      cancelUserAppointment,
      getAdminFixedAppointments,
      getUserFixedAppointments,
      getAvailableFixedAppointments,
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};
