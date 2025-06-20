
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Plus, Edit, Trash2, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppointment } from '@/contexts/AppointmentContext';
import { useUser } from '@/contexts/UserContext';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import { FixedAppointment } from '@/types/appointment';

const appointmentSchema = z.object({
  date: z.date({
    required_error: 'Please select a date',
  }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.enum(['available', 'unavailable']),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const AdminAppointments = () => {
  const { user } = useUser();
  const { 
    fixedAppointments, 
    createFixedAppointment, 
    updateFixedAppointment, 
    deleteFixedAppointment,
    getAdminFixedAppointments 
  } = useAppointment();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<FixedAppointment | null>(null);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      status: 'available',
    },
  });

  const adminAppointments = user ? getAdminFixedAppointments(user.id) : [];
  const selectedDateAppointments = selectedDate 
    ? adminAppointments.filter(app => app.date === format(selectedDate, 'yyyy-MM-dd'))
    : [];

  const onSubmit = (data: AppointmentFormData) => {
    if (!user) return;

    const appointmentData = {
      adminId: user.id,
      adminName: user.name,
      date: format(data.date, 'yyyy-MM-dd'),
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status as 'available' | 'unavailable',
    };

    if (editingAppointment) {
      updateFixedAppointment(editingAppointment.id, appointmentData);
    } else {
      createFixedAppointment(appointmentData);
    }

    setIsDialogOpen(false);
    setEditingAppointment(null);
    form.reset();
  };

  const handleEdit = (appointment: FixedAppointment) => {
    setEditingAppointment(appointment);
    form.setValue('date', parseISO(appointment.date));
    form.setValue('startTime', appointment.startTime);
    form.setValue('endTime', appointment.endTime);
    form.setValue('status', appointment.status === 'available' ? 'available' : 'unavailable');
    setIsDialogOpen(true);
  };

  const handleDelete = (appointmentId: string) => {
    deleteFixedAppointment(appointmentId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Available</Badge>;
      case 'booked':
        return <Badge variant="default" className="bg-blue-600"><User className="w-3 h-3 mr-1" />Booked</Badge>;
      case 'expired':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      case 'unavailable':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Unavailable</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <RoleBasedNavigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Appointment Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your appointment schedule and availability
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Calendar
              </CardTitle>
              <CardDescription>
                Select a date to view or add appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasAppointment: adminAppointments.map(app => parseISO(app.date)),
                }}
                modifiersStyles={{
                  hasAppointment: { backgroundColor: 'rgb(59 130 246)', color: 'white' },
                }}
              />
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4" onClick={() => {
                    setEditingAppointment(null);
                    form.reset();
                    if (selectedDate) {
                      form.setValue('date', selectedDate);
                    }
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingAppointment ? 'Update the appointment details' : 'Create a new appointment slot'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                onChange={(e) => field.onChange(parseISO(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="unavailable">Unavailable</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1">
                          {editingAppointment ? 'Update' : 'Create'} Appointment
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Appointments List/Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Appointments Overview
              </CardTitle>
              <CardDescription>
                Manage all your appointment slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adminAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments scheduled yet</p>
                  <p className="text-sm">Create your first appointment slot</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned User</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          {format(parseISO(appointment.date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {appointment.startTime} - {appointment.endTime}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        <TableCell>
                          {appointment.assignedUserName || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(appointment)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(appointment.id)}
                              disabled={appointment.status === 'booked'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Appointments</p>
                  <p className="text-2xl font-bold">{adminAppointments.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                  <p className="text-2xl font-bold text-green-600">
                    {adminAppointments.filter(app => app.status === 'available').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Booked</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {adminAppointments.filter(app => app.status === 'booked').length}
                  </p>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unavailable</p>
                  <p className="text-2xl font-bold text-red-600">
                    {adminAppointments.filter(app => app.status === 'unavailable').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
