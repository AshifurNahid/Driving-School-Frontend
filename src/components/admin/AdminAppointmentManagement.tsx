import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Plus, Edit, Trash2, ChevronLeft, ChevronRight, User } from 'lucide-react';
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
  instructorId: z.string().min(1, 'Instructor is required'),
  courseId: z.string().min(1, 'Course is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().optional(),
}).refine(
  (data) => {
    // Compare times as "HH:MM"
    return data.startTime < data.endTime;
  },
  {
    message: "End time must be greater than start time",
    path: ["endTime"],
  }
);

type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Dummy instructor data
const DUMMY_INSTRUCTORS = [
  { id: 1, name: 'Dr. John Smith', department: 'Computer Science' },
  { id: 2, name: 'Prof. Sarah Johnson', department: 'Mathematics' },
  { id: 3, name: 'Dr. Michael Brown', department: 'Physics' },
  { id: 4, name: 'Prof. Emily Davis', department: 'Chemistry' },
  { id: 5, name: 'Dr. Robert Wilson', department: 'Biology' },
];

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
    (state: RootState) => state.guest_course
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

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      instructorId: '',
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

  // Handle dialog open/close to ensure form is properly reset
  useEffect(() => {
    if (isDialogOpen && editingAppointment) {
      // Reset form with appointment data when dialog opens for editing
      form.reset({
        instructorId: editingAppointment.instructorId ? editingAppointment.instructorId.toString() : '1',
        courseId: editingAppointment.courseId ? editingAppointment.courseId.toString() : '',
        startTime: editingAppointment.startTime || '',
        endTime: editingAppointment.endTime || '',
        location: editingAppointment.location || '',
      });
    } else if (isDialogOpen && !editingAppointment) {
      // Reset form to empty when dialog opens for new appointment
      form.reset({
        instructorId: '',
        courseId: '',
        startTime: '',
        endTime: '',
        location: '',
      });
    }
  }, [isDialogOpen, editingAppointment, form]);

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
      reloadAppointments();
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
      reloadAppointments();
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
      reloadAppointments();
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
      instructorId: parseInt(data.instructorId),
      courseId: parseInt(data.courseId), // Will be 0 if "All" is selected
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location || undefined,
    };

    if (editingAppointment) {
      dispatch(updateAppointmentSlot(editingAppointment.id, appointmentData));
    } else {
      dispatch(createAppointmentSlot(appointmentData));
    }
  };

  const handleEdit = (appointment: any) => {
    setEditingAppointment(appointment);
    // Use setTimeout to ensure form reset happens after state update
    setTimeout(() => {
      form.reset({
        instructorId: appointment.instructorId ? appointment.instructorId.toString() : '1',
        courseId: appointment.courseId ? appointment.courseId.toString() : '',
        startTime: appointment.startTime || '',
        endTime: appointment.endTime || '',
        location: appointment.location || '',
      });
    }, 0);
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
      instructorId: '',
      courseId: '',
      startTime: '',
      endTime: '',
      location: '',
    }, { keepValues: false });
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
                        {/* Display price if available */}
                        {appointment.pricePerSlot > 0 && (
                          <span className="text-xs text-green-600 font-medium">
                            ${appointment.pricePerSlot}
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

      {/* Add/Edit Dialog - Modern and Larger */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {editingAppointment ? (
                <>
                  <Edit className="w-6 h-6" />
                  Edit Time Slot
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  Add New Time Slot
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingAppointment ? 'Update the time slot details below' : `Create a new time slot for ${selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'selected date'}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Instructor and Course Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="instructorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Instructor
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue placeholder="Select an instructor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DUMMY_INSTRUCTORS.map((instructor) => (
                              <SelectItem key={instructor.id} value={instructor.id.toString()}>
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">{instructor.name}</span>
                                  <span className="text-xs text-muted-foreground">{instructor.department}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Course
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select a course"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">All</SelectItem>
                            {courses.map((course) => (
                              <SelectItem key={course?.id} value={course?.id.toString()}>
                                {course?.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Start Time
                        </FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-12 text-base">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          End Time
                        </FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-12 text-base">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Location (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter location (e.g., Room 101, Building A)" 
                          {...field} 
                          className="h-12 text-base" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 text-base font-medium"
                    disabled={createLoading || updateLoading}
                  >
                    {createLoading || updateLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <span>{editingAppointment ? 'Update' : 'Create'} Time Slot</span>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)} 
                    className="h-12 text-base"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAppointmentManagement;