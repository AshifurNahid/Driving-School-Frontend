// components/AdminAppointmentManagement.tsx

import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Plus, Edit, Trash2, ChevronLeft, ChevronRight, User, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useToast } from '@/hooks/use-toast';
import { 
  getAppointmentSlotsByDate, 
  createAppointmentSlot, 
  updateAppointmentSlot,
  deleteAppointmentSlot
} from '@/redux/actions/appointmentAction';
import { listInstructors } from '@/redux/actions/instructorActions';
import { 
  APPOINTMENT_SLOT_CREATE_RESET,
  APPOINTMENT_SLOT_UPDATE_RESET,
  APPOINTMENT_SLOT_DELETE_RESET
} from '@/redux/constants/appointmentConstants';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import AppointmentForm from '../../ui/AppointmentForm';

const AdminAppointmentManagement = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state selectors
  const { appointmentSlots: slotsData, loading: slotsLoading, error: slotsError } = useSelector(
    (state: RootState) => state.appointmentSlots
  );
  const appointmentSlots = Array.isArray(slotsData) ? slotsData : [];

  const { courses = [], loading: coursesLoading } = useSelector(
    (state: RootState) => state.guest_course
  );
  
  // Instructors state
  const { instructors = [], loading: instructorsLoading, error: instructorsError } = useSelector(
    (state: RootState) => state.instructorList
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
  
  // Local state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<any>(null);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(listInstructors());
  }, [dispatch]);

  // Fetch appointment slots when date changes
  useEffect(() => {
    if (selectedDate) {
      dispatch(getAppointmentSlotsByDate(format(selectedDate, 'yyyy-MM-dd')));
    }
  }, [selectedDate, dispatch]);

  // Reload appointments after CRUD operations
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
      setEditingAppointment(null);
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
  }, [createSuccess, createError, toast, dispatch]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      toast({
        title: "Success",
        description: "Appointment slot updated successfully",
      });
      setIsDialogOpen(false);
      setEditingAppointment(null);
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
  }, [updateSuccess, updateError, toast, dispatch]);

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
  }, [deleteSuccess, deleteError, toast, dispatch]);

  const handleFormSubmit = (data: any) => {
    const appointmentData = {
      instructorId: data.instructorId,
      date: data.date,
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
    setIsDialogOpen(true);
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
    setEditingAppointment(null);
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return { 
          component: <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Deleted</Badge>,
          color: 'red'
        };
      case 1:
        return { 
          component: <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-600 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600">Available</Badge>,
          color: 'green'
        };
      case 2:
        return { 
          component: <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Booked</Badge>,
          color: 'blue'
        };
      default:
        return { 
          component: <Badge variant="outline" className="text-xs">Unknown</Badge>,
          color: 'gray'
        };
    }
  };

  // Filter out soft-deleted appointments (status=0) from the display
  const visibleAppointments = appointmentSlots.filter(slot => slot.status !== 0);

  // Format time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get instructor name by ID
  const getInstructorName = (instructorId: number) => {
    const instructor = instructors.find(inst => inst.id === instructorId);
    return instructor ? instructor.instructor_name : 'Unknown Instructor';
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Appointment Slot Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage appointment slots for instructors
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Panel - Calendar */}
          <div className="xl:col-span-1">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Calendar
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Select a date to view or create appointment slots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Custom Calendar Header */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 h-9 w-9 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 h-9 w-9 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-0"
                  modifiers={{
                    hasAppointment: appointmentSlots.map(app => parseISO(app.date)),
                  }}
                  modifiersStyles={{
                    hasAppointment: { 
                      backgroundColor: 'rgb(59 130 246)', 
                      color: 'white',
                      fontWeight: '600'
                    },
                  }}
                />
                
                {/* Legend */}
       
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Time Slots */}
          <div className="xl:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                      Appointment Slots - {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                      {visibleAppointments.length} slots available on this date
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddNewSlot}
                    className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                    disabled={!selectedDate || createLoading || updateLoading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Slot
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Loading State */}
                {slotsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Loading slots...</span>
                  </div>
                ) : slotsError ? (
                  /* Error State */
                  <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Error Loading Slots</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center">{slotsError}</p>
                    <Button
                      onClick={reloadAppointments}
                      variant="outline"
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : visibleAppointments.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-16">
                    <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No Appointment Slots
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                      {selectedDate 
                        ? `No slots created for ${format(selectedDate, 'MMMM d, yyyy')} yet.`
                        : 'Select a date to view or create appointment slots.'
                      }
                    </p>
                    {selectedDate && (
                      <Button
                        onClick={handleAddNewSlot}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Slot
                      </Button>
                    )}
                  </div>
                ) : (
                  /* Slots List */
                  <div className="space-y-4">
                    {visibleAppointments.map((slot, index) => (
                      <div
                        key={slot.id}
                        className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="font-medium">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </span>
                              </div>
                              {getStatusBadge(slot.status).component}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <User className="w-4 h-4" />
                                <span>Instructor: {getInstructorName(slot.instructorId)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                              </div>
                              {slot.location && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 md:col-span-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>Location: {slot.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(slot)}
                              disabled={createLoading || updateLoading || deleteLoading}
                              className="h-9 px-3 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(slot)}
                              disabled={createLoading || updateLoading || deleteLoading}
                              className="h-9 px-3 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {editingAppointment ? 'Edit Appointment Slot' : 'Create New Appointment Slot'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {editingAppointment 
                ? 'Update the appointment slot details below'
                : 'Fill in the details to create a new appointment slot'
              }
            </DialogDescription>
          </DialogHeader>
          
          <AppointmentForm
            instructors={instructors}
            instructorsLoading={instructorsLoading}
            instructorsError={instructorsError}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={createLoading || updateLoading}
            editingAppointment={editingAppointment}
            selectedDate={selectedDate}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              Delete Appointment Slot
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this appointment slot? This action cannot be undone.
              {appointmentToDelete && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatTime(appointmentToDelete.startTime)} - {formatTime(appointmentToDelete.endTime)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Instructor: {getInstructorName(appointmentToDelete.instructorId)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAppointmentManagement;