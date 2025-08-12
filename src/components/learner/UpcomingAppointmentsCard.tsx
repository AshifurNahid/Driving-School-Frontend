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
            <div className="text-center py-4 text-red-500">{error}</div>
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