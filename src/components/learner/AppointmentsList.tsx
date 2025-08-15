// This component has been integrated into AppointmentsSection.tsx with enhanced UI
// This file can be deleted if no longer referenced elsewhere

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';

interface AppointmentsListProps {
  title: string;
  appointments: any[];
  emptyMessage: string;
}

const AppointmentsList = ({ title, appointments, emptyMessage }: AppointmentsListProps) => {
  console.warn('AppointmentsList component is deprecated. Use enhanced AppointmentsSection instead.');
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-muted-foreground">{emptyMessage}</div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">This component has been enhanced.</p>
            <p className="text-sm text-gray-500">Please use the new AppointmentsSection component.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;