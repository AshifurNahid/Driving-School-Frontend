import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { getStatusBadge } from './utils/appointmentUtils';

interface AppointmentsListProps {
  title: string;
  appointments: any[];
  emptyMessage: string;
}

const AppointmentsList = ({ title, appointments, emptyMessage }: AppointmentsListProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-muted-foreground">{emptyMessage}</div>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="pt-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{appointment.type}</h3>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {appointment.date} | {appointment.start_time} - {appointment.end_time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;