import { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useToast } from '@/hooks/use-toast';
import { 
  getAppointmentSlotsByDate, 
  createAppointmentSlot, 
  updateAppointmentSlot,
  deleteAppointmentSlot
} from '@/redux/actions/appointmentAction';
import { getCourses } from '@/redux/actions/courseAction';
import { 
  APPOINTMENT_SLOT_CREATE_RESET,
  APPOINTMENT_SLOT_UPDATE_RESET,
  APPOINTMENT_SLOT_DELETE_RESET
} from '@/redux/constants/appointmentConstants';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

const appointmentSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const AdminAppointmentManagement = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state selectors
  const { appointmentSlots: slotsData, loading: slotsLoading, error: slotsError } = useSelector(
    (state: RootState) => state.appointmentSlots
  );
  // Ensure appointmentSlots is always an array
  const appointmentSlots = Array.isArray(slotsData) ? slotsData : [];

  const { courses = [], loading: coursesLoading } = useSelector(
    (state: RootState) => state.courseList
  );
  const { success: createSuccess, error: createError, loading: createLoading } = useSelector(
    (state: RootState) => state.appointmentSlotCreate
  );
  const { success: updateSuccess, error: updateError, loading: updateLoading } = useSelector(
    (state: RootState) => state.appointmentSlotUpdate
  );
  const { success: deleteSuccess, error: deleteError, loading: deleteLoading } = useSelector(
    (state: RootState) => state.appointmentSlotDelete
  );
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<any>(null);

  // Dummy instructor ID as requested in requirements
  const DUMMY_INSTRUCTOR_ID = 1;

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      courseId: '',
      startTime: '',
      endTime: '',
      location: '',
    },
  });

  const TIME_OPTIONS = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  // Fetch courses on component mount
  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  // Fetch appointment slots when date changes
  useEffect(() => {
    if (selectedDate) {
      dispatch(getAppointmentSlotsByDate(format(selectedDate, 'yyyy-MM-dd')));
    }
  }, [selectedDate, dispatch]);

  // Refetch appointments after CRUD
  const reloadAppointments = () => {
    if (selectedDate) {
      dispatch(getAppointmentSlotsByDate(format(selectedDate, 'yyyy-MM-dd')));
    }
  };

  // Handle create success
  useEffect(() => {
    if (createSuccess) {
      toast({
        title: "Success",
        description: "Appointment slot created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
      dispatch({ type: APPOINTMENT_SLOT_CREATE_RESET });
      reloadAppointments(); // <-- reload after create
    }
    if (createError) {
      toast({
        title: "Error",
        description: createError,
        variant: "destructive",
      });
    }
  }, [createSuccess, createError, toast, dispatch, form, selectedDate]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      toast({
        title: "Success",
        description: "Appointment slot updated successfully",
      });
      setIsDialogOpen(false);
      setEditingAppointment(null);
      form.reset();
      dispatch({ type: APPOINTMENT_SLOT_UPDATE_RESET });
      reloadAppointments(); // <-- reload after update
    }
    if (updateError) {
      toast({
        title: "Error",
        description: updateError,
        variant: "destructive",
      });
    }
  }, [updateSuccess, updateError, toast, dispatch, form, selectedDate]);

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      toast({
        title: "Success",
        description: "Appointment slot deleted successfully",
      });
      dispatch({ type: APPOINTMENT_SLOT_DELETE_RESET });
      reloadAppointments(); // <-- reload after delete
    }
    if (deleteError) {
      toast({
        title: "Error",
        description: deleteError,
        variant: "destructive",
      });
    }
  }, [deleteSuccess, deleteError, toast, dispatch, selectedDate]);

  const onSubmit = (data: AppointmentFormData) => {
    if (!selectedDate) return;

    const appointmentData = {
      instructorId: DUMMY_INSTRUCTOR_ID,
      courseId: parseInt(data.courseId),
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location || undefined,
      // Note: We don't set status here as it's now handled in the action creators
    };

    if (editingAppointment) {
      dispatch(updateAppointmentSlot(editingAppointment.id, appointmentData));
    } else {
      dispatch(createAppointmentSlot(appointmentData));
    }
  };

  const handleEdit = (appointment: any) => {
    setEditingAppointment(appointment);
    form.setValue('startTime', appointment.startTime);
    form.setValue('endTime', appointment.endTime);
    form.setValue('location', appointment.location || '');
    form.setValue('courseId', appointment.courseId ? appointment.courseId.toString() : '');
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (appointment: any) => {
    setAppointmentToDelete(appointment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (appointmentToDelete) {
      dispatch(deleteAppointmentSlot(Number(appointmentToDelete.id)));
      setDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    }
  };

  const handleAddNewSlot = () => {
    setEditingAppointment(null);
    form.reset({
      courseId: '',
      startTime: '',
      endTime: '',
      location: '',
    });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="destructive" className="text-xs">Deleted</Badge>;
      case 1:
        return <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Available</Badge>;
      case 2:
        return <Badge variant="default" className="bg-blue-600 text-xs">Booked</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  // Filter out soft-deleted appointments (status=0) from the display
  const visibleAppointments = Array.isArray(appointmentSlots) 
    ? appointmentSlots.filter(slot => slot.status !== 0) 
    : [];

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
                hasAppointment: Array.isArray(appointmentSlots) ? appointmentSlots.map(app => parseISO(app.date)) : [],
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
            {slotsLoading ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <p className="text-sm">Loading appointment slots...</p>
              </div>
            ) : slotsError ? (
              <div className="text-center py-6 sm:py-8 text-red-500">
                <p className="text-sm">Error: {slotsError}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {!visibleAppointments || visibleAppointments.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <p className="text-lg sm:text-xl">--:-- --</p>
                    <p className="text-xs sm:text-sm mt-2">No time slots set for this date</p>
                  </div>
                ) : (
                  visibleAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border rounded-lg gap-3 sm:gap-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <span className="font-medium text-sm sm:text-base">
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                        {appointment.location && (
                          <span className="text-xs text-muted-foreground">
                            📍 {appointment.location}
                          </span>
                        )}
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
                        <AlertDialog open={deleteDialogOpen && appointmentToDelete?.id === appointment.id} onOpenChange={setDeleteDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(appointment)}
                              disabled={deleteLoading}
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Appointment Slot</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this appointment slot?<br />
                                <span className="text-xs text-muted-foreground">
                                  This action cannot be undone.
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete} disabled={deleteLoading}>
                                {deleteLoading ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
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
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Course</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select a course"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Start Time</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.slice(0, TIME_OPTIONS.length - 1).map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.slice(1).map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Location (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter location" 
                        {...field} 
                        className="text-sm" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Hidden instructor info for reference */}
              <div className="text-xs text-muted-foreground">
                Instructor: Dummy Instructor (ID: {DUMMY_INSTRUCTOR_ID})
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 text-sm"
                  disabled={createLoading || updateLoading}
                >
                  {createLoading || updateLoading ? (
                    <span>Loading...</span>
                  ) : (
                    <span>{editingAppointment ? 'Update' : 'Create'} Time Slot</span>
                  )}
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
