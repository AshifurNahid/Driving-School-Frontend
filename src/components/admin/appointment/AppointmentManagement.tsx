
import React, { useState, useMemo } from 'react';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  User, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointment } from '@/contexts/AppointmentContext';
import { getStatusBadge } from './utils/appointmentUtils';
import UserProfileDialog from './UserProfileDialog';

interface AppointmentEntry {
  id: string;
  learnerName: string;
  learnerEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  adminName: string;
  note?: string;
}

const AppointmentManagement = () => {
  const { fixedAppointments, userAppointments, updateFixedAppointment } = useAppointment();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ name: string; email: string } | null>(null);

  // Mock data - in real app this would come from context/API
  const mockAppointments: AppointmentEntry[] = [
    {
      id: '1',
      learnerName: 'John Doe',
      learnerEmail: 'john@example.com',
      date: '2024-12-25',
      startTime: '10:00',
      endTime: '10:30',
      status: 'pending',
      adminName: 'Dr. Sarah Johnson',
      note: 'First consultation'
    },
    {
      id: '2',
      learnerName: 'Jane Smith',
      learnerEmail: 'jane@example.com',
      date: '2024-12-26',
      startTime: '14:00',
      endTime: '14:30',
      status: 'approved',
      adminName: 'Dr. Sarah Johnson'
    },
    {
      id: '3',
      learnerName: 'Mike Wilson',
      learnerEmail: 'mike@example.com',
      date: '2024-12-15',
      startTime: '09:00',
      endTime: '09:30',
      status: 'completed',
      adminName: 'Dr. Sarah Johnson'
    },
    {
      id: '4',
      learnerName: 'Sarah Brown',
      learnerEmail: 'sarah@example.com',
      date: '2024-12-10',
      startTime: '11:00',
      endTime: '11:30',
      status: 'cancelled',
      adminName: 'Dr. Sarah Johnson'
    }
  ];

  const [appointments, setAppointments] = useState<AppointmentEntry[]>(mockAppointments);

  const handleStatusUpdate = (appointmentId: string, newStatus: 'approved' | 'rejected') => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId 
          ? { ...app, status: newStatus }
          : app
      )
    );
  };

  const handleViewProfile = (userName: string, userEmail: string) => {
    setSelectedUser({ name: userName, email: userEmail });
    setProfileDialogOpen(true);
  };

  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = appointments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
  }, [appointments, statusFilter, sortBy]);

  const upcomingAppointments = filteredAndSortedAppointments.filter(app => 
    isFuture(parseISO(app.date)) || app.date === format(new Date(), 'yyyy-MM-dd')
  );

  const pastAppointments = filteredAndSortedAppointments.filter(app => 
    isPast(parseISO(app.date)) && app.date !== format(new Date(), 'yyyy-MM-dd')
  );

  const getStatusVariant = (status: string) => {
    const statusConfig = getStatusBadge(status);
    return statusConfig.variant;
  };

  const AppointmentCard = ({ appointment }: { appointment: AppointmentEntry }) => (
    <Card className="mb-4">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{appointment.learnerName}</span>
              </div>
              <Badge variant={getStatusVariant(appointment.status)} className="text-xs w-fit">
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{format(parseISO(appointment.date), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{appointment.startTime} - {appointment.endTime}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{appointment.learnerEmail}</p>
            {appointment.note && (
              <p className="text-sm text-muted-foreground mt-1 italic">Note: {appointment.note}</p>
            )}
          </div>
          
          <div className="flex flex-row sm:flex-col gap-2">
            {appointment.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                  onClick={() => handleStatusUpdate(appointment.id, 'approved')}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1 sm:flex-none"
                  onClick={() => handleStatusUpdate(appointment.id, 'rejected')}
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Reject
                </Button>
              </>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 sm:flex-none"
              onClick={() => handleViewProfile(appointment.learnerName, appointment.learnerEmail)}
            >
              <Eye className="w-3 h-3 mr-1" />
              Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Appointment Management</h2>
          <p className="text-muted-foreground">Manage student appointment requests and history</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <ChevronDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="status">Sort by Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            History ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Upcoming Appointments</h3>
                <p className="text-muted-foreground">There are no upcoming appointments at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Appointment History</h3>
                <p className="text-muted-foreground">There are no past appointments to display.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* User Profile Dialog */}
      {selectedUser && (
        <UserProfileDialog
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          userName={selectedUser.name}
          userEmail={selectedUser.email}
        />
      )}
    </div>
  );
};

export default AppointmentManagement;
