
// components/admin/appointment/AppointmentManagement.tsx

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Eye, 
  Check, 
  X, 
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { 
  getAdminPreviousAppointments, 
  getAdminUpcomingAppointments, 
  updateAppointmentStatus, 
  cancelAppointment,
  AdminAppointmentItem 
} from '@/redux/actions/appointmentAction';
import { listInstructors } from '@/redux/actions/instructorActions';
import { ADMIN_APPOINTMENT_CANCEL_RESET } from '@/redux/constants/appointmentConstants';
import { useUserDetails } from '@/hooks/useUserDetails';

const AppointmentManagement = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state selectors - Updated to use new admin appointment states
  const { 
    appointments: previousAppointments = [], 
    loading: previousLoading, 
    error: previousError,
    pagination: previousPagination 
  } = useSelector((state: RootState) => state.adminPreviousAppointments);

  const { 
    appointments: upcomingAppointments = [], 
    loading: upcomingLoading, 
    error: upcomingError,
    pagination: upcomingPagination 
  } = useSelector((state: RootState) => state.adminUpcomingAppointments);

  const { 
    loading: statusUpdateLoading, 
    success: statusUpdateSuccess, 
    error: statusUpdateError 
  } = useSelector((state: RootState) => state.adminAppointmentStatusUpdate);

  const { 
    loading: cancelLoading, 
    success: cancelSuccess, 
    error: cancelError 
  } = useSelector((state: RootState) => state.adminAppointmentCancel);

  // Instructors state for filtering
  const { instructors = [], loading: instructorsLoading } = useSelector(
    (state: RootState) => state.instructorList
  );

  // Local state
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [instructorFilter, setInstructorFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    appointment: AdminAppointmentItem | null;
    action: string;
  }>({ open: false, appointment: null, action: '' });

  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    appointment: AdminAppointmentItem | null;
    reason: string;
  }>({ open: false, appointment: null, reason: '' });

  // Get current appointments and loading state based on active tab
  const currentAppointments = activeTab === 'upcoming' ? upcomingAppointments : previousAppointments;
  const currentLoading = activeTab === 'upcoming' ? upcomingLoading : previousLoading;
  const currentError = activeTab === 'upcoming' ? upcomingError : previousError;
  const currentPagination = activeTab === 'upcoming' ? upcomingPagination : previousPagination;

  // Helper function to get instructor name
  const getInstructorName = (instructorId: number): string => {
    const instructor = instructors.find(inst => inst.id === instructorId);
    return instructor?.instructor_name || `Instructor ${instructorId}`;
  };

  // Get unique user IDs from current appointments
  const userIds = currentAppointments.map((appointment: AdminAppointmentItem) => appointment.userId);
  const { getUserName, getUserEmail, getUserPhone, loading: userDetailsLoading, error: userDetailsError } = useUserDetails(userIds);

  // Fetch data on component mount and tab change
  useEffect(() => {
    dispatch(listInstructors());
    if (activeTab === 'upcoming') {
      dispatch(getAdminUpcomingAppointments(currentPage, itemsPerPage));
    } else {
      dispatch(getAdminPreviousAppointments(currentPage, itemsPerPage));
    }
  }, [dispatch, activeTab, currentPage, itemsPerPage]);

  // Handle status update success
  useEffect(() => {
    if (statusUpdateSuccess) {
      // Refetch data when status is updated
      if (activeTab === 'upcoming') {
        dispatch(getAdminUpcomingAppointments(currentPage, itemsPerPage));
      } else {
        dispatch(getAdminPreviousAppointments(currentPage, itemsPerPage));
      }
    }
  }, [statusUpdateSuccess, dispatch, activeTab, currentPage, itemsPerPage]);

  // Handle cancel success
  useEffect(() => {
    if (cancelSuccess) {
      // Show success message
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
      
      // Refetch data when appointment is cancelled
      if (activeTab === 'upcoming') {
        dispatch(getAdminUpcomingAppointments(currentPage, itemsPerPage));
      } else {
        dispatch(getAdminPreviousAppointments(currentPage, itemsPerPage));
      }
      
      // Close dialog and reset state
      setCancelDialog({ open: false, appointment: null, reason: '' });
      dispatch({ type: ADMIN_APPOINTMENT_CANCEL_RESET });
    }
  }, [cancelSuccess, dispatch, activeTab, currentPage, itemsPerPage, toast]);

  // Handle cancel error
  useEffect(() => {
    if (cancelError) {
      toast({
        title: "Error",
        description: cancelError,
        variant: "destructive",
      });
      
      // Reset error state
      dispatch({ type: ADMIN_APPOINTMENT_CANCEL_RESET });
    }
  }, [cancelError, dispatch, toast]);

  // Filter and search logic - Updated to work with API data structure
  const filteredAppointments = currentAppointments.filter((appointment: AdminAppointmentItem) => {
    const instructorName = getInstructorName(appointment.appointmentSlot.instructorId);
    const userName = getUserName(appointment.userId);
    
    const matchesSearch = 
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserEmail(appointment.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserPhone(appointment.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.note.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesInstructor = instructorFilter === 'all' || instructorName === instructorFilter;
    
    return matchesSearch && matchesStatus && matchesInstructor;
  });

  // Sort logic - Updated for API data structure
  const sortedAppointments = [...filteredAppointments].sort((a: AdminAppointmentItem, b: AdminAppointmentItem) => {
    let aValue: any = '';
    let bValue: any = '';
    
    switch (sortField) {
      case 'date':
        aValue = new Date(a.appointmentSlot.date).getTime();
        bValue = new Date(b.appointmentSlot.date).getTime();
        break;
      case 'learnerName':
        aValue = getUserName(a.userId).toLowerCase();
        bValue = getUserName(b.userId).toLowerCase();
        break;
      case 'instructorName':
        aValue = getInstructorName(a.appointmentSlot.instructorId).toLowerCase();
        bValue = getInstructorName(b.appointmentSlot.instructorId).toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      default:
        aValue = a[sortField as keyof AdminAppointmentItem];
        bValue = b[sortField as keyof AdminAppointmentItem];
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Use filtered appointments length for pagination, but display all when no server-side pagination
  const displayAppointments = sortedAppointments;
  const totalFilteredCount = filteredAppointments.length;

  // Updated stats calculations
  const totalCount = currentPagination?.totalCount || currentAppointments.length;
  const pendingCount = currentAppointments.filter((a: AdminAppointmentItem) => a.status.toLowerCase() === 'booked').length;
  const approvedCount = currentAppointments.filter((a: AdminAppointmentItem) => a.status.toLowerCase() === 'approved').length;
  const rejectedCount = currentAppointments.filter((a: AdminAppointmentItem) => a.status.toLowerCase() === 'rejected').length;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    const statusConfig: Record<string, any> = {
      booked: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      approved: { variant: 'default', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      rejected: { variant: 'destructive', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
      completed: { variant: 'outline', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      cancelled: { variant: 'secondary', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
    };
    return statusConfig[normalizedStatus] || statusConfig.booked;
  };

  const handleActionClick = (appointment: AdminAppointmentItem, action: string) => {
    setConfirmDialog({ open: true, appointment, action });
  };

  const handleConfirmAction = () => {
    const { appointment, action } = confirmDialog;
    
    if (appointment) {
      dispatch(updateAppointmentStatus(appointment.id, action));
      
      toast({
        title: "Processing",
        description: `${action.charAt(0).toUpperCase() + action.slice(1)}ing appointment...`,
      });
    }
    
    setConfirmDialog({ open: false, appointment: null, action: '' });
  };

  const handleCancelClick = (appointment: AdminAppointmentItem) => {
    setCancelDialog({ open: true, appointment, reason: '' });
  };

  const handleConfirmCancel = () => {
    const { appointment, reason } = cancelDialog;
    
    if (appointment && reason.trim()) {
      dispatch(cancelAppointment(appointment.id, reason));
      
      toast({
        title: "Processing",
        description: "Cancelling appointment...",
      });
      
      setCancelDialog({ open: false, appointment: null, reason: '' });
    } else {
      toast({
        title: "Error",
        description: "Please provide a cancellation reason.",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (appointment: AdminAppointmentItem) => {
    toast({
      title: "View Profile",
      description: `Viewing profile for User ${appointment.userId}`,
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (activeTab === 'upcoming') {
      dispatch(getAdminUpcomingAppointments(newPage, itemsPerPage));
    } else {
      dispatch(getAdminPreviousAppointments(newPage, itemsPerPage));
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const formatTime = (time: string) => {
    const [hours = '', minutes = ''] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header with Tabs */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Appointment Management
            </CardTitle>
            {/* <CardDescription className="text-gray-600 dark:text-gray-400">
              Manage and review appointment requests from students
            </CardDescription> */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mt-2">
              <Button
                variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveTab('upcoming');
                  setCurrentPage(1);
                }}
                className="flex-1"
              >
                Upcoming Appointments
              </Button>
              <Button
                variant={activeTab === 'previous' ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveTab('previous');
                  setCurrentPage(1);
                }}
                className="flex-1"
              >
                Previous Appointments
              </Button>
            </div>
          </CardHeader>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCount}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                </div>
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                </div>
                <X className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Appointment Requests
            </CardTitle>
           
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by student name, email, phone, instructor, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={instructorFilter} onValueChange={setInstructorFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <SelectValue placeholder="Filter by instructor" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="all">All Instructors</SelectItem>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.instructor_name}>
                        {instructor.instructor_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {displayAppointments.length} of {totalFilteredCount} appointments
              {currentPagination && (
                <span className="ml-2">
                  (Page {currentPagination.pageNumber} of {currentPagination.totalPages}, Total: {currentPagination.totalCount})
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden">
          {currentLoading || userDetailsLoading ? (
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  {currentLoading ? 'Loading appointments...' : 'Loading user details...'}
                </span>
              </div>
            </CardContent>
          ) : currentError || userDetailsError ? (
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Error Loading Data</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {currentError || userDetailsError}
                </p>
                {userDetailsError && !currentError && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                    Appointments loaded, but some user details may be unavailable.
                  </p>
                )}
              </div>
            </CardContent>
          ) : displayAppointments.length === 0 ? (
            <CardContent className="p-16">
              <div className="flex flex-col items-center justify-center">
                <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No {activeTab === 'upcoming' ? 'Upcoming' : 'Previous'} Appointments
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {activeTab === 'upcoming' 
                    ? 'No upcoming appointment requests found. New appointments will appear here when students make requests.'
                    : 'No previous appointment requests found. Completed and past appointments will appear here.'
                  }
                </p>
              </div>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('learnerName')}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Student
                        <SortIcon field="learnerName" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('instructorName')}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Instructor
                        <SortIcon field="instructorName" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Date & Time
                        <SortIcon field="date" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Course Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Status
                        <SortIcon field="status" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {displayAppointments.map((appointment: AdminAppointmentItem) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {getUserName(appointment.userId)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {getUserEmail(appointment.userId)}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {getUserPhone(appointment.userId)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {getInstructorName(appointment.appointmentSlot.instructorId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {format(new Date(appointment.appointmentSlot.date), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTime(appointment.appointmentSlot.startTime)} - {formatTime(appointment.appointmentSlot.endTime)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {appointment.appointmentType}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {appointment.hoursConsumed}h - ${appointment.amountPaid}
                          </div>
                          {appointment.appointmentSlot.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <MapPin className="w-3 h-3" />
                              {appointment.appointmentSlot.location}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={getStatusBadge(appointment.status).variant}
                          className={getStatusBadge(appointment.status).className}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProfile(appointment)}
                            className="h-8 px-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {appointment.status.toLowerCase() === 'booked' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelClick(appointment)}
                              className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                              disabled={cancelLoading}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {currentPagination && currentPagination.totalPages > 1 && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPagination.pageNumber} of {currentPagination.totalPages}
                  <span className="ml-2 text-gray-500">
                    ({currentPagination.totalCount} total appointments)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPagination.pageNumber - 1)}
                    disabled={!currentPagination.hasPreviousPage || currentLoading}
                    className="h-9 px-3"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPagination.pageNumber + 1)}
                    disabled={!currentPagination.hasNextPage || currentLoading}
                    className="h-9 px-3"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, appointment: null, action: '' })}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              Confirm {confirmDialog.action?.charAt(0).toUpperCase() + confirmDialog.action?.slice(1)}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to {confirmDialog.action} this appointment request from
              <span className="font-medium"> {confirmDialog.appointment ? getUserName(confirmDialog.appointment.userId) : ''}</span>?
              {confirmDialog.action === 'rejected' && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  This action will notify the student that their request has been declined.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={statusUpdateLoading}
              className={
                confirmDialog.action === 'approved'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {statusUpdateLoading ? 'Processing...' : confirmDialog.action?.charAt(0).toUpperCase() + confirmDialog.action?.slice(1)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Appointment Dialog */}
      <AlertDialog open={cancelDialog.open} onOpenChange={(open) => !open && setCancelDialog({ open: false, appointment: null, reason: '' })}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              Cancel Appointment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to cancel this appointment for
              <span className="font-medium"> {cancelDialog.appointment ? getUserName(cancelDialog.appointment.userId) : ''}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cancellation Reason *
              </label>
              <Input
                value={cancelDialog.reason}
                onChange={(e) => setCancelDialog(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Please provide a reason for cancellation..."
                className="w-full"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelLoading || !cancelDialog.reason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelLoading ? 'Cancelling...' : 'Cancel Appointment'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentManagement;
