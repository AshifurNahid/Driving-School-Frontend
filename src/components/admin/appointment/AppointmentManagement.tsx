
// components/admin/appointment/AppointmentManagement.tsx

import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Eye,
  X,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Mail,
  Phone,
  FileText
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
  AdminAppointmentItem,
  assignInstructorToSlot,
  getAppointmentSlotUserInfo
} from '@/redux/actions/appointmentAction';
import { listInstructors } from '@/redux/actions/instructorActions';
import { ADMIN_APPOINTMENT_CANCEL_RESET, APPOINTMENT_SLOT_ASSIGN_RESET } from '@/redux/constants/appointmentConstants';
import { useUserDetails } from '@/hooks/useUserDetails';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

  const {
    success: assignSuccess,
    error: assignError,
    loading: assignLoading,
  } = useSelector((state: RootState) => state.appointmentSlotAssign);

  const {
    loading: bookingInfoLoading,
    data: bookingInfo,
    error: bookingInfoError,
  } = useSelector((state: RootState) => state.adminAppointmentUserInfo);

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

  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    appointment: AdminAppointmentItem | null;
    instructorId: string;
  }>({ open: false, appointment: null, instructorId: '' });

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  // Get current appointments and loading state based on active tab
  const currentAppointments = activeTab === 'upcoming' ? upcomingAppointments : previousAppointments;
  const currentLoading = activeTab === 'upcoming' ? upcomingLoading : previousLoading;
  const currentError = activeTab === 'upcoming' ? upcomingError : previousError;
  const currentPagination = activeTab === 'upcoming' ? upcomingPagination : previousPagination;

  // Helper function to get instructor name
  const getInstructorName = (instructorId: number): string => {
    if (!instructorId) return 'No Instructor';
    const instructor = instructors.find(inst => inst.id === instructorId);
    return instructor?.instructor_name || `Instructor ${instructorId}`;
  };

  const getInstructorEmail = (instructorId: number): string => {
    if (!instructorId) return '—';
    const instructor = instructors.find(inst => inst.id === instructorId);
    return instructor?.description || '—';
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

  useEffect(() => {
    if (assignSuccess) {
      toast({
        title: "Success",
        description: "Instructor assigned successfully",
      });

      setAssignDialog({ open: false, appointment: null, instructorId: '' });
      dispatch({ type: APPOINTMENT_SLOT_ASSIGN_RESET });

      if (activeTab === 'upcoming') {
        dispatch(getAdminUpcomingAppointments(currentPage, itemsPerPage));
      } else {
        dispatch(getAdminPreviousAppointments(currentPage, itemsPerPage));
      }
    }

    if (assignError) {
      toast({
        title: "Error",
        description: assignError,
        variant: "destructive",
      });
      dispatch({ type: APPOINTMENT_SLOT_ASSIGN_RESET });
    }
  }, [assignSuccess, assignError, toast, dispatch, activeTab, currentPage, itemsPerPage]);

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
      (appointment.note || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.cancelReason || '').toLowerCase().includes(searchTerm.toLowerCase());
    
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
  const cancelledCount = currentAppointments.filter((a: AdminAppointmentItem) => a.status.toLowerCase() === 'cancelled').length;
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
    setBookingDialogOpen(true);
    dispatch(getAppointmentSlotUserInfo(appointment.appointmentSlot.id));
  };

  const handleAssignClick = (appointment: AdminAppointmentItem) => {
    setAssignDialog({ open: true, appointment, instructorId: appointment.appointmentSlot.instructorId?.toString() || '' });
  };

  const handleConfirmAssign = () => {
    if (assignDialog.appointment && assignDialog.instructorId) {
      dispatch(assignInstructorToSlot(assignDialog.appointment.appointmentSlot.id, Number(assignDialog.instructorId)));
    } else {
      toast({
        title: "Error",
        description: "Please select an instructor before assigning.",
        variant: "destructive",
      });
    }
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

  const renderInfoRow = (label: string, value: React.ReactNode) => (
    <div className="flex flex-col gap-1 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
      <div className="text-sm text-gray-900 dark:text-gray-100">{value || 'N/A'}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto space-y-6 px-4 lg:px-8 py-6">
        {/* Hero */}
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_35%)]" />
          <CardHeader className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                Appointment Requests
              </div>
              <CardTitle className="text-3xl font-semibold">Manage learner appointments with confidence</CardTitle>
              <CardDescription className="text-white/80 max-w-2xl text-base">
                Track, review, and action every learner request from a modern command center. Filter by status, assign instructors,
                and keep every journey on schedule.
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/15 text-white border-white/30">Pending: {pendingCount}</Badge>
                <Badge className="bg-white/10 text-white border-white/30">Cancelled: {cancelledCount}</Badge>
                <Badge className="bg-white/10 text-white border-white/30">Rejected: {rejectedCount}</Badge>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 rounded-2xl bg-white/10 p-4 text-white shadow-lg backdrop-blur-sm lg:w-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Viewing</p>
                  <p className="text-xl font-bold capitalize">{activeTab} requests</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Total requests</p>
                  <p className="text-3xl font-semibold">{totalCount}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 rounded-xl bg-white/5 p-2">
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Clock className="w-4 h-4" />
                  <span>{totalFilteredCount} results after filters</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant={activeTab === 'upcoming' ? 'secondary' : 'outline'}
                    onClick={() => {
                      setActiveTab('upcoming');
                      setCurrentPage(1);
                    }}
                    className="h-11 justify-center rounded-lg border-white/30 bg-white/10 text-white hover:bg-white/20"
                  >
                    Upcoming Requests
                  </Button>
                  <Button
                    variant={activeTab === 'previous' ? 'secondary' : 'outline'}
                    onClick={() => {
                      setActiveTab('previous');
                      setCurrentPage(1);
                    }}
                    className="h-11 justify-center rounded-lg border-white/30 bg-white/10 text-white hover:bg-white/20"
                  >
                    Previous Requests
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[{ label: 'Total Requests', value: totalCount, icon: Calendar, accent: 'from-blue-100 to-blue-50' },
            { label: 'Pending', value: pendingCount, icon: Clock, accent: 'from-amber-100 to-amber-50' },
            { label: 'Cancelled', value: cancelledCount, icon: X, accent: 'from-slate-100 to-white' },
            { label: 'Rejected', value: rejectedCount, icon: AlertCircle, accent: 'from-rose-100 to-rose-50' }].map((stat) => (
              <Card key={stat.label} className={`overflow-hidden border-0 shadow-lg bg-gradient-to-br ${stat.accent}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                      <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                      <div className="h-1 w-16 rounded-full bg-slate-900/10" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md">
                      <stat.icon className="w-6 h-6 text-slate-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur dark:bg-gray-900/60">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">Appointment request queue</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Slice through requests with smart filters and a modern search experience.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="h-8 rounded-full px-4 text-sm">
                Showing {displayAppointments.length} / {totalFilteredCount}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by learner, contact, instructor, course, or notes"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 pl-10 text-base shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 bg-white shadow-inner dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="booked">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={instructorFilter} onValueChange={setInstructorFilter}>
                  <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 bg-white shadow-inner dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <SelectValue placeholder="Filter by instructor" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <SelectItem value="all">All Instructors</SelectItem>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.instructor_name}>
                        {instructor.instructor_name}
                      </SelectItem>
                    ))}
                    <SelectItem value="No Instructor">No Instructor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Badge variant="outline" className="rounded-full border-dashed">Total: {totalCount}</Badge>
              <Badge variant="outline" className="rounded-full border-dashed">Filtered: {totalFilteredCount}</Badge>
              <Badge variant="outline" className="rounded-full border-dashed">Page size: {itemsPerPage}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur dark:bg-gray-900/70">
          {currentLoading || userDetailsLoading ? (
            <CardContent className="p-10">
              <div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                <span>{currentLoading ? 'Loading appointments...' : 'Loading user details...'}</span>
              </div>
            </CardContent>
          ) : currentError || userDetailsError ? (
            <CardContent className="p-10">
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Error loading data</h3>
                  <p className="text-gray-600 dark:text-gray-400">{currentError || userDetailsError}</p>
                </div>
                {userDetailsError && !currentError && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Appointments loaded, but some user details may be unavailable.</p>
                )}
              </div>
            </CardContent>
          ) : displayAppointments.length === 0 ? (
            <CardContent className="p-16">
              <div className="flex flex-col items-center justify-center gap-3 text-center text-gray-700 dark:text-gray-200">
                <Calendar className="w-16 h-16 text-gray-400" />
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">No {activeTab === 'upcoming' ? 'upcoming' : 'previous'} appointments</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                    {activeTab === 'upcoming'
                      ? 'New appointment requests will appear here as soon as learners schedule time.'
                      : 'Completed and past appointments will be listed here for historical context.'}
                  </p>
                </div>
              </div>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>{displayAppointments.length} requests in view</span>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleSort('date')} className="flex items-center gap-1 text-xs uppercase tracking-wide text-gray-500 hover:text-blue-600">
                    Sort by date
                    <SortIcon field="date" />
                  </button>
                  <button onClick={() => handleSort('learnerName')} className="flex items-center gap-1 text-xs uppercase tracking-wide text-gray-500 hover:text-blue-600">
                    Sort by learner
                    <SortIcon field="learnerName" />
                  </button>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-100/80 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:bg-gray-900/60 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Instructor</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Course Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Cancel Reason</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-sm dark:divide-gray-800 dark:bg-gray-900">
                  {displayAppointments.map((appointment: AdminAppointmentItem) => {
                    const instructorId = appointment.appointmentSlot.instructorId;
                    const instructorLabel = getInstructorName(instructorId);
                    const noInstructor = !instructorId;

                    return (
                      <tr key={appointment.id} className="hover:bg-blue-50/60 dark:hover:bg-gray-800/60">
                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="text-base font-semibold text-gray-900 dark:text-gray-50">{getUserName(appointment.userId)}</span>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Mail className="w-4 h-4" />
                              <span>{getUserEmail(appointment.userId)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                              <Phone className="w-4 h-4" />
                              <span>{getUserPhone(appointment.userId)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold">{instructorLabel}</span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{getInstructorEmail(instructorId)}</div>
                              {noInstructor && (
                                <Badge variant="outline" className="rounded-full border-dashed text-xs">Awaiting assignment</Badge>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAssignClick(appointment)}
                              className="h-8 px-3 rounded-full border-blue-200 text-blue-600 shadow-sm hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30"
                              disabled={assignLoading}
                            >
                              Assign
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="space-y-1 text-gray-900 dark:text-gray-100">
                            <div className="font-semibold">{format(new Date(appointment.appointmentSlot.date), 'MMM dd, yyyy')}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {formatTime(appointment.appointmentSlot.startTime)} - {formatTime(appointment.appointmentSlot.endTime)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="space-y-1 text-gray-900 dark:text-gray-100">
                            <span className="font-medium">{appointment.appointmentType}</span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{appointment.hoursConsumed}h · ${appointment.amountPaid}</div>
                            {appointment.appointmentSlot.location && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <MapPin className="w-3 h-3" />
                                {appointment.appointmentSlot.location}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <Badge
                            variant={getStatusBadge(appointment.status).variant}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(appointment.status).className}`}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 align-top text-gray-700 dark:text-gray-300">
                          {appointment.cancelReason ? (
                            <div className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                <span className="line-clamp-2">{appointment.cancelReason}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right align-top">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProfile(appointment)}
                              className="h-9 rounded-full border-gray-200 px-3 text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {appointment.status.toLowerCase() === 'booked' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelClick(appointment)}
                                className="h-9 rounded-full border-red-200 px-3 text-red-600 shadow-sm hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/40"
                                disabled={cancelLoading}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {currentPagination && currentPagination.totalPages > 1 && (
          <Card className="border-0 bg-white/90 shadow-lg backdrop-blur dark:bg-gray-900/70">
            <CardContent className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPagination.pageNumber} of {currentPagination.totalPages}
                  <span className="ml-2 text-gray-500">({currentPagination.totalCount} total appointments)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPagination.pageNumber - 1)}
                    disabled={!currentPagination.hasPreviousPage || currentLoading}
                    className="h-10 rounded-full px-4"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPagination.pageNumber + 1)}
                    disabled={!currentPagination.hasNextPage || currentLoading}
                    className="h-10 rounded-full px-4"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Booking Details</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Review learner and appointment information for this booking.
            </DialogDescription>
          </DialogHeader>

          {bookingInfoLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading booking info...</span>
            </div>
          )}

          {bookingInfoError && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-200">
              {bookingInfoError}
            </div>
          )}

          {!bookingInfoLoading && !bookingInfoError && bookingInfo && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-sm dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <User className="w-5 h-5" /> Learner Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {renderInfoRow(
                    'Name',
                    `${bookingInfo.userFirstName || ''} ${bookingInfo.userLastName || ''}`.trim() || '-'
                  )}
                  {renderInfoRow(
                    'Email',
                    (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{bookingInfo.userEmail || '-'}</span>
                      </div>
                    )
                  )}
                  {renderInfoRow(
                    'Phone',
                    (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{bookingInfo.userPhone || '-'}</span>
                      </div>
                    )
                  )}
                  {renderInfoRow('Course', bookingInfo.courseName || 'N/A')}
                  {renderInfoRow('Permit Number', bookingInfo.permitNumber || 'N/A')}
                  {renderInfoRow(
                    'Permit Issue Date',
                    bookingInfo.learnerPermitIssueDate ? format(parseISO(bookingInfo.learnerPermitIssueDate), 'dd MMM yyyy') : 'N/A'
                  )}
                  {renderInfoRow(
                    'Permit Expiration Date',
                    bookingInfo.permitExpirationDate ? format(parseISO(bookingInfo.permitExpirationDate), 'dd MMM yyyy') : 'N/A'
                  )}
                  {renderInfoRow('Driving Experience', bookingInfo.drivingExperience || 'N/A')}
                  {renderInfoRow('License From Another Country', bookingInfo.isLicenceFromAnotherCountry ? 'Yes' : 'No')}
                </CardContent>
              </Card>

              <Card className="shadow-sm dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Calendar className="w-5 h-5" /> Appointment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {renderInfoRow('Appointment ID', bookingInfo.appointmentId)}
                  {renderInfoRow('Type', bookingInfo.appointmentType || 'N/A')}
                  {renderInfoRow(
                    'Status',
                    <Badge className="bg-purple-100 text-purple-700 border border-purple-200">{bookingInfo.appointmentStatus || 'N/A'}</Badge>
                  )}
                  {renderInfoRow('Hours Booked', bookingInfo.hoursConsumed)}
                  {renderInfoRow('Amount Paid', bookingInfo.amountPaid ? `$${bookingInfo.amountPaid}` : 'N/A')}
                  {renderInfoRow('Note', bookingInfo.note || 'N/A')}
                  {renderInfoRow('Cancellation Reason', bookingInfo.cancelReason || bookingInfo.cancellationReason || 'N/A')}
                  {renderInfoRow(
                    'Booked At',
                    bookingInfo.appointmentCreatedAt
                      ? format(parseISO(bookingInfo.appointmentCreatedAt), 'dd MMM yyyy, p')
                      : 'N/A'
                  )}
                  {renderInfoRow(
                    'Slot Schedule',
                    bookingInfo.appointmentSlot
                      ? `${format(parseISO(bookingInfo.appointmentSlot.date), 'dd MMM yyyy')} • ${formatTime(
                          bookingInfo.appointmentSlot.startTime
                        )} - ${formatTime(bookingInfo.appointmentSlot.endTime)}`
                      : 'N/A'
                  )}
                  {renderInfoRow('Instructor ID', bookingInfo.appointmentSlot?.instructorId ?? 'N/A')}
                  {renderInfoRow('Price Per Slot', bookingInfo.appointmentSlot?.pricePerSlot ? `$${bookingInfo.appointmentSlot.pricePerSlot}` : 'N/A')}
                </CardContent>
              </Card>

              <Card className="shadow-sm dark:border-gray-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <FileText className="w-5 h-5" /> Additional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {renderInfoRow('Appointment Slot ID', bookingInfo.availableAppointmentSlotId)}
                  {renderInfoRow('Course ID', bookingInfo.userCourseId ?? 'N/A')}
                  {renderInfoRow('Location', bookingInfo.appointmentSlot?.location || 'N/A')}
                  {renderInfoRow(
                    'Slot Created',
                    bookingInfo.appointmentSlot?.createdAt
                      ? format(parseISO(bookingInfo.appointmentSlot.createdAt), 'dd MMM yyyy, p')
                      : 'N/A'
                  )}
                  {renderInfoRow(
                    'Slot Updated',
                    bookingInfo.appointmentSlot?.updatedAt
                      ? format(parseISO(bookingInfo.appointmentSlot.updatedAt), 'dd MMM yyyy, p')
                      : 'N/A'
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={assignDialog.open}
        onOpenChange={(open) => {
          setAssignDialog({ open, appointment: open ? assignDialog.appointment : null, instructorId: open ? assignDialog.instructorId : '' });
          if (!open) {
            dispatch({ type: APPOINTMENT_SLOT_ASSIGN_RESET });
          }
        }}
      >
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Assign Instructor
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Choose an instructor to assign to this appointment slot.
            </DialogDescription>
          </DialogHeader>

          {assignDialog.appointment && (
            <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 text-sm text-gray-800 dark:text-gray-200">
              <p className="font-semibold">
                {format(parseISO(assignDialog.appointment.appointmentSlot.date), 'dd-MMM-yyyy')} • {formatTime(assignDialog.appointment.appointmentSlot.startTime)}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Location: {assignDialog.appointment.appointmentSlot.location || 'N/A'}</p>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Instructor</label>
            <Select value={assignDialog.instructorId} onValueChange={(value) => setAssignDialog((prev) => ({ ...prev, instructorId: value }))}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Select instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor.id} value={instructor.id.toString()}>
                    {instructor.instructor_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {assignError && (
              <p className="text-sm text-red-600 dark:text-red-400">{assignError}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setAssignDialog({ open: false, appointment: null, instructorId: '' })}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAssign} disabled={!assignDialog.instructorId || assignLoading}>
              {assignLoading ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
