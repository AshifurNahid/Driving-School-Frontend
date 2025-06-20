
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppointment } from '@/contexts/AppointmentContext';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';
import { Calendar, Clock, User, X, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AppointmentHistory = () => {
  const { user, isAdmin } = useUser();
  const { getAdminAppointments, getLearnerAppointments, cancelAppointment } = useAppointment();

  if (!user) return null;

  const appointments = isAdmin 
    ? getAdminAppointments(user.id)
    : getLearnerAppointments(user.id);

  const upcomingAppointments = appointments.filter(app => {
    const appointmentDate = new Date(`${app.date} ${app.startTime}`);
    return appointmentDate > new Date() && app.status === 'confirmed';
  });

  const pastAppointments = appointments.filter(app => {
    const appointmentDate = new Date(`${app.date} ${app.startTime}`);
    return appointmentDate <= new Date() || app.status === 'cancelled';
  });

  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointment(appointmentId);
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled successfully.",
    });
  };

  const AppointmentCard = ({ appointment, showCancelButton = false }: { appointment: any, showCancelButton?: boolean }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={`https://ui-avatars.com/api/?name=${isAdmin ? appointment.learnerName : appointment.adminName}`} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <p className="font-medium">
                {isAdmin ? appointment.learnerName : appointment.adminName}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(appointment.date), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {appointment.startTime} - {appointment.endTime}
                </div>
              </div>
              
              {appointment.note && (
                <div className="flex items-start gap-1 text-sm">
                  <MessageSquare className="h-3 w-3 mt-0.5 text-muted-foreground" />
                  <p className="text-muted-foreground">{appointment.note}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
              {appointment.status}
            </Badge>
            
            {showCancelButton && appointment.status === 'confirmed' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this appointment? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleCancelAppointment(appointment.id)}>
                      Cancel Appointment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        <h2 className="text-2xl font-bold">
          {isAdmin ? 'Your Appointments' : 'My Appointments'}
        </h2>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
        <div className="space-y-3">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No upcoming appointments.</p>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showCancelButton={true}
              />
            ))
          )}
        </div>
      </div>

      {/* Past Appointments */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Past Appointments</h3>
        <div className="space-y-3">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No past appointments.</p>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showCancelButton={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistory;
