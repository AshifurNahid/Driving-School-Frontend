
import { useState } from 'react';
import { format, parseISO, isAfter, isToday } from 'date-fns';
import { Calendar, Clock, User, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppointment } from '@/contexts/AppointmentContext';
import { useUser } from '@/contexts/UserContext';
import { FixedAppointment, UserAppointment } from '@/types/appointment';
import { toast } from '@/hooks/use-toast';

const requestSchema = z.object({
  note: z.string().optional(),
});

type RequestFormData = z.infer<typeof requestSchema>;

const UserAppointmentView = () => {
  const { user } = useUser();
  const {
    getAvailableFixedAppointments,
    getUserFixedAppointments,
    requestAppointment,
    cancelUserAppointment
  } = useAppointment();

  const [selectedAppointment, setSelectedAppointment] = useState<FixedAppointment | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  const availableAppointments = getAvailableFixedAppointments();
  const userAppointments = user ? getUserFixedAppointments(user.id) : [];

  // Get upcoming appointments
  const upcomingAppointments = userAppointments.filter(app => {
    const appointmentDate = parseISO(app.date);
    return (isAfter(appointmentDate, new Date()) || isToday(appointmentDate)) && app.status !== 'cancelled';
  });

  const onRequestSubmit = (data: RequestFormData) => {
    if (!user || !selectedAppointment) return;

    requestAppointment({
      appointmentId: selectedAppointment.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      note: data.note,
    });

    toast({
      title: "Appointment Requested",
      description: "Your appointment has been confirmed successfully!",
    });

    setIsRequestDialogOpen(false);
    setSelectedAppointment(null);
    form.reset();
  };

  const handleCancelAppointment = (appointmentId: string) => {
    cancelUserAppointment(appointmentId);
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* My Appointments Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-6 h-6" />
              My Appointments
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Your scheduled appointments</p>
          </div>
        </div>

        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No upcoming appointments
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse available appointments below to schedule your first appointment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.slice(0, 1).map((appointment) => (
              <Card key={appointment.id} className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Next Appointment</CardTitle>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{format(parseISO(appointment.date), 'EEEE, MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.startTime} - {appointment.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span>with {appointment.adminName}</span>
                    </div>
                    {appointment.note && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <strong>Note:</strong> {appointment.note}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => handleCancelAppointment(appointment.appointmentId)}
                  >
                    Cancel Appointment
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {upcomingAppointments.slice(1).map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Appointment</CardTitle>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{format(parseISO(appointment.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.startTime} - {appointment.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span>{appointment.adminName}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => handleCancelAppointment(appointment.appointmentId)}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Available Appointments Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Available Appointments
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Book your next appointment</p>
          </div>
        </div>

        {availableAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No available appointments
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back later for new appointment slots
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Available
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{format(parseISO(appointment.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{appointment.startTime} - {appointment.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{appointment.adminName}</span>
                    </div>
                  </div>
                  
                  <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book Appointment</DialogTitle>
                        <DialogDescription>
                          Confirm your appointment booking with {selectedAppointment?.adminName}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedAppointment && (
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Appointment Details:</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Date:</strong> {format(parseISO(selectedAppointment.date), 'EEEE, MMM dd, yyyy')}</p>
                              <p><strong>Time:</strong> {selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
                              <p><strong>With:</strong> {selectedAppointment.adminName}</p>
                            </div>
                          </div>
                          
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onRequestSubmit)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Additional Notes (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Any specific requirements or notes for your appointment..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="flex gap-2 pt-4">
                                <Button type="submit" className="flex-1">
                                  Confirm Booking
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setIsRequestDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserAppointmentView;
