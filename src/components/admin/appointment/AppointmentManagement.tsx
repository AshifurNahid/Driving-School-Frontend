
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
import { listInstructors } from '@/redux/actions/instructorActions';

const AppointmentManagement = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state selectors
  const { appointments: appointmentsData, loading: appointmentsLoading, error: appointmentsError } = useSelector(
    (state: RootState) => state.userAppointments
  );
  const appointments = Array.isArray(appointmentsData) ? appointmentsData : [];

  // Instructors state for filtering
  const { instructors = [], loading: instructorsLoading } = useSelector(
    (state: RootState) => state.instructorList
  );

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [instructorFilter, setInstructorFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    appointment: any;
    action: string;
  }>({ open: false, appointment: null, action: '' });

  // Fetch data on component mount
  useEffect(() => {
    dispatch(listInstructors());
    // dispatch(getUserAppointments()); // You'll need to implement this action
  }, [dispatch]);

  // Mock data for demonstration - replace with actual API call
  const mockAppointments = [
    {
      id: 1,
      learnerName: 'John Doe',
      learnerEmail: 'john.doe@email.com',
      adminName: 'Md Alamin Bhuiyan',
      date: '2025-01-20',
      startTime: '09:00',
      endTime: '10:00',
      status: 'pending',
      courseName: 'Basic Driving Course',
      location: 'Main Campus',
      note: 'First time learner'
    },
    {
      id: 2,
      learnerName: 'Jane Smith',
      learnerEmail: 'jane.smith@email.com',
      adminName: 'Rana',
      date: '2025-01-21',
      startTime: '14:00',
      endTime: '15:00',
      status: 'approved',
      courseName: 'Advanced Driving Course',
      location: 'Practice Ground',
      note: 'Needs highway practice'
    },
    {
      id: 3,
      learnerName: 'Mike Johnson',
      learnerEmail: 'mike.johnson@email.com',
      adminName: 'Md Alamin Bhuiyan',
      date: '2025-01-22',
      startTime: '11:00',
      endTime: '12:00',
      status: 'rejected',
      courseName: 'Basic Driving Course',
      location: 'Main Campus',
      note: 'Schedule conflict'
    }
  ];

  // Filter and search logic
  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = 
      appointment.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.learnerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesInstructor = instructorFilter === 'all' || appointment.adminName === instructorFilter;
    
    return matchesSearch && matchesStatus && matchesInstructor;
  });

  // Sort logic
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    let aValue = a[sortField as keyof typeof a];
    let bValue = b[sortField as keyof typeof b];
    
    if (sortField === 'date') {
      aValue = new Date(a.date).getTime();
      bValue = new Date(b.date).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = sortedAppointments.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, any> = {
      pending: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      approved: { variant: 'default', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      rejected: { variant: 'destructive', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
      completed: { variant: 'outline', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      cancelled: { variant: 'secondary', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const handleActionClick = (appointment: any, action: string) => {
    setConfirmDialog({ open: true, appointment, action });
  };

  const handleConfirmAction = () => {
    const { appointment, action } = confirmDialog;
    
    toast({
      title: "Success",
      description: `Appointment ${action} successfully`,
    });
    
    setConfirmDialog({ open: false, appointment: null, action: '' });
    
    // Here you would typically call an API to update the appointment status
    // dispatch(updateAppointmentStatus(appointment.id, action));
  };

  const handleViewProfile = (appointment: any) => {
    // Handle viewing user profile
    toast({
      title: "View Profile",
      description: `Viewing profile for ${appointment.learnerName}`,
    });
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockAppointments.length}</p>
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
                  <p className="text-2xl font-bold text-yellow-600">{mockAppointments.filter(a => a.status === 'pending').length}</p>
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
                  <p className="text-2xl font-bold text-green-600">{mockAppointments.filter(a => a.status === 'approved').length}</p>
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
                  <p className="text-2xl font-bold text-red-600">{mockAppointments.filter(a => a.status === 'rejected').length}</p>
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
                  placeholder="Search by student name, email, instructor, or course..."
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
              Showing {paginatedAppointments.length} of {filteredAppointments.length} appointments
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden">
          {appointmentsLoading ? (
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading appointments...</span>
              </div>
            </CardContent>
          ) : appointmentsError ? (
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Error Loading Appointments</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">{appointmentsError}</p>
              </div>
            </CardContent>
          ) : filteredAppointments.length === 0 ? (
            <CardContent className="p-16">
              <div className="flex flex-col items-center justify-center">
                <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Appointment Requests
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  No appointment requests found matching your criteria.
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
                        onClick={() => handleSort('adminName')}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Instructor
                        <SortIcon field="adminName" />
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
                      Course
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
                  {paginatedAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {appointment.learnerName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.learnerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {appointment.adminName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {format(new Date(appointment.date), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {appointment.courseName}
                          </div>
                          {appointment.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <MapPin className="w-3 h-3" />
                              {appointment.location}
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
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleActionClick(appointment, 'approved')}
                                className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleActionClick(appointment, 'rejected')}
                                className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
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
        {totalPages > 1 && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-9 px-3"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
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
              <span className="font-medium"> {confirmDialog.appointment?.learnerName}</span>?
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
              className={
                confirmDialog.action === 'approved'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {confirmDialog.action?.charAt(0).toUpperCase() + confirmDialog.action?.slice(1)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentManagement;
