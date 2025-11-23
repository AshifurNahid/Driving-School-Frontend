// components/AdminAppointmentManagement.tsx

import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Plus, Edit, Trash2, User, MapPin, AlertCircle, Search, ChevronDown } from 'lucide-react';
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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        return <Badge className="text-xs px-4 py-1.5 bg-red-100 text-red-700 hover:bg-red-100 border border-red-200">Deleted</Badge>;
      case 1:
        return <Badge className="text-xs px-4 py-1.5 bg-green-100 text-green-700 hover:bg-green-100 border border-green-200">Open</Badge>;
      case 2:
        return <Badge className="text-xs px-4 py-1.5 bg-orange-100 text-orange-700 hover:bg-orange-100 border border-orange-200">Booked</Badge>;
      default:
        return <Badge variant="outline" className="text-xs px-4 py-1.5">Unknown</Badge>;
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Manage Appointments</h1>
        </div>

        {/* Top Bar with Search, Date Selector, and Add Button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px] max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Date Selector */}
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-11 px-4 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {selectedDate ? format(selectedDate, 'dd MMM yyyy') : 'Select Date'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                  className="bg-white dark:bg-gray-800"
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
              </PopoverContent>
            </Popover>

            {/* Add Appointment Button */}
            <Button
              onClick={handleAddNewSlot}
              className="h-11 bg-purple-600 hover:bg-purple-700 text-white font-medium px-6"
              disabled={!selectedDate || createLoading || updateLoading}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Appointment
            </Button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {slotsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading slots...</span>
            </div>
          ) : slotsError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Error Loading Slots</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">{slotsError}</p>
              <Button onClick={reloadAppointments} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          ) : visibleAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
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
                <Button onClick={handleAddNewSlot} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Slot
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Instructor Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      <div className="flex items-center gap-1">
                        Appointment Date & Time
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {visibleAppointments.map((slot) => (
                    <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {getInstructorName(slot.instructorId)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {slot.location || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {format(parseISO(slot.date), 'dd-MMM-yyyy')} at {formatTime(slot.startTime)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(slot.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleEdit(slot)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg"
                            disabled={createLoading || updateLoading || deleteLoading}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(slot)}
                            variant="outline"
                            className="p-2 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            disabled={createLoading || updateLoading || deleteLoading}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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