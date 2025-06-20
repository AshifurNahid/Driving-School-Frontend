
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppointment } from '@/contexts/AppointmentContext';
import { useUser } from '@/contexts/UserContext';
import { FixedAppointment } from '@/types/appointment';

const appointmentSchema = z.object({
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.enum(['available', 'unavailable']),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const AdminAppointmentManagement = () => {
  const { user } = useUser();
  const { 
    createFixedAppointment, 
    updateFixedAppointment, 
    deleteFixedAppointment,
    getAdminFixedAppointments 
  } = useAppointment();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
    if (!user || !selectedDate) return;

    const appointmentData = {
      adminId: user.id,
      adminName: user.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
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
    form.setValue('startTime', appointment.startTime);
    form.setValue('endTime', appointment.endTime);
    form.setValue('status', appointment.status === 'available' ? 'available' : 'unavailable');
    setIsDialogOpen(true);
  };

  const handleDelete = (appointmentId: string) => {
    deleteFixedAppointment(appointmentId);
  };

  const handleAddNewSlot = () => {
    setEditingAppointment(null);
    form.reset({ status: 'available' });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Available</Badge>;
      case 'booked':
        return <Badge variant="default" className="bg-blue-600 text-xs">Booked</Badge>;
      case 'unavailable':
        return <Badge variant="destructive" className="text-xs">Unavailable</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-0">
      <div className="mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          Appointment Management
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your appointment schedule and availability
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Panel - Calendar */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {/* Custom Calendar Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="text-foreground hover:bg-accent h-8 w-8 p-0"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <span className="font-medium text-sm sm:text-base text-foreground">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="text-foreground hover:bg-accent h-8 w-8 p-0"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
            
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="bg-background text-foreground border-border [&_.rdp-day_selected]:bg-primary [&_.rdp-day_selected]:text-primary-foreground [&_.rdp-table]:w-full [&_.rdp-cell]:text-center [&_.rdp-day]:h-8 [&_.rdp-day]:w-8 [&_.rdp-day]:text-sm sm:[&_.rdp-day]:h-9 sm:[&_.rdp-day]:w-9 [&_.rdp-day:hover]:bg-accent [&_.rdp-day:hover]:text-accent-foreground pointer-events-auto"
              modifiers={{
                hasAppointment: adminAppointments.map(app => parseISO(app.date)),
              }}
              modifiersStyles={{
                hasAppointment: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' },
              }}
            />
          </CardContent>
        </Card>

        {/* Right Panel - Time Slots */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">
                  Time Slots for {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Selected Date'}
                </span>
              </CardTitle>
              <Button 
                onClick={handleAddNewSlot} 
                size="sm" 
                className="w-full sm:w-auto"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Add</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-3">
              {selectedDateAppointments.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  <p className="text-lg sm:text-xl">--:-- --</p>
                  <p className="text-xs sm:text-sm mt-2">No time slots set for this date</p>
                </div>
              ) : (
                selectedDateAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border rounded-lg gap-3 sm:gap-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span className="font-medium text-sm sm:text-base">
                        {appointment.startTime} - {appointment.endTime}
                      </span>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(appointment)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(appointment.id)}
                        disabled={appointment.status === 'booked'}
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingAppointment ? 'Edit Time Slot' : 'Add New Time Slot'}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {editingAppointment ? 'Update the time slot details' : `Create a new time slot for ${selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'selected date'}`}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button type="submit" className="flex-1 text-sm">
                  {editingAppointment ? 'Update' : 'Create'} Time Slot
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="text-sm">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAppointmentManagement;
