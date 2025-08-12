import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import AppointmentsList from './AppointmentsList';

interface AppointmentsSectionProps {
  appointments: any[];
  appointmentsLoading: boolean;
  appointmentsError: string | null;
}

const AppointmentsSection = ({ 
  appointments, 
  appointmentsLoading, 
  appointmentsError 
}: AppointmentsSectionProps) => {
  if (appointmentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium">Loading appointments...</div>
      </div>
    );
  }

  if (appointmentsError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-red-500">Error loading appointments: {appointmentsError}</div>
      </div>
    );
  }

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    apt => apt.status !== 'cancelled' && new Date(apt.date) >= now
  );
  const historyAppointments = appointments.filter(
    apt => apt.status === 'cancelled' || new Date(apt.date) < now
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">My Appointments</h2>
        <Button onClick={() => window.location.href = "/appointments"}>
          <Calendar className="h-4 w-4 mr-2" />
          Take New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AppointmentsList 
          title="Upcoming Appointments"
          appointments={upcomingAppointments}
          emptyMessage="No upcoming appointments."
        />
        
        <AppointmentsList 
          title="History"
          appointments={historyAppointments}
          emptyMessage="No appointment history."
        />
      </div>
    </div>
  );
};

export default AppointmentsSection;