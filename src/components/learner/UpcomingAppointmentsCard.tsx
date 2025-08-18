import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStatusIcon, getStatusBadge } from './utils/appointmentUtils';

interface UpcomingAppointmentsCardProps {
  appointments: any[];
  loading: boolean;
  error: string | null;
}

const UpcomingAppointmentsCard = ({ appointments, loading, error }: UpcomingAppointmentsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-4">Loading appointments...</div>
          ) : error ? (
            // Handle specific case when user has no appointments (404 error)
            error.includes('404') || error.includes('No appointments found') ? (
              <div className="text-center py-4 px-2 sm:py-6 sm:px-4">
                <div className="text-muted-foreground mb-2 text-sm sm:text-base font-medium">
                  No Appointments Yet
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  You haven't booked any driving lessons yet. Start your driving journey by scheduling your first appointment!
                </div>
              </div>
            ) : (
              <div className="text-center py-4 px-2 text-red-500 text-xs sm:text-sm break-words">{error}</div>
            )
          ) : appointments.filter(apt => apt.status !== 'cancelled').length > 0 ? (
            appointments.filter(apt => apt.status !== 'cancelled').slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(appointment.status)}
                  <div>
                    <div className="font-medium">{appointment.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.date} | {appointment.start_time} - {appointment.end_time}
                    </div>
                  </div>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">No upcoming appointments</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsCard;