<<<<<<< HEAD
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard,
  FileText,
  Download,
  Eye,
  Plus,
  Timer,
  DollarSign,
  CalendarDays,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import AppointmentDetailModal from './AppointmentDetailModal';
=======
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import AppointmentsList from './AppointmentsList';
>>>>>>> 82e036b (feat: enhence learner profile)

interface AppointmentsSectionProps {
  appointments: any[];
  appointmentsLoading: boolean;
  appointmentsError: string | null;
}

<<<<<<< HEAD
interface AppointmentType {
  id: number;
  userId: number;
  availableAppointmentSlotId: number;
  userCourseId: number | null;
  appointmentType: string;
  hoursConsumed: number;
  amountPaid: number;
  note: string;
  learnerPermitIssueDate: string;
  permitNumber: string;
  permitExpirationDate: string;
  drivingExperience: string;
  isLicenceFromAnotherCountry: boolean;
  status: string;
  createdAt: string;
  appointmentSlot: {
    id: number;
    instructorId: number;
    courseId: number;
    date: string;
    startTime: string;
    endTime: string;
    location: string | null;
    status: number;
    createdById: number;
    updatedById: number;
    createdAt: string;
    updatedAt: string;
    pricePerSlot: number;
  };
  userCourse: any;
}

const AppointmentsSection = ({ 
  appointments = [], 
  appointmentsLoading, 
  appointmentsError 
}: AppointmentsSectionProps) => {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Validate appointments data
  const validAppointments = Array.isArray(appointments) 
    ? appointments.filter(apt => apt && apt.appointmentSlot) 
    : [];

  const getStatusConfig = (status: string) => {
    const configs = {
      'Booked': { 
        color: 'bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-600', 
        icon: CheckCircle, 
        iconColor: 'text-blue-500 dark:text-blue-400' 
      },
      'Completed': { 
        color: 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-600', 
        icon: CheckCircle, 
        iconColor: 'text-green-500 dark:text-green-400' 
      },
      'Cancelled': { 
        color: 'bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-600', 
        icon: XCircle, 
        iconColor: 'text-red-500 dark:text-red-400' 
      },
      'Pending': { 
        color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-600', 
        icon: AlertCircle, 
        iconColor: 'text-yellow-500 dark:text-yellow-400' 
      }
    };
    return configs[status as keyof typeof configs] || configs['Pending'];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const downloadPDF = (appointment: AppointmentType) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(59, 130, 246);
    pdf.text('DRIVING SCHOOL APPOINTMENT SLIP', 20, 30);
    
    // Appointment ID
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Appointment ID: #${appointment.id}`, 20, 50);
    pdf.text(`Booking Date: ${new Date(appointment.createdAt).toLocaleDateString()}`, 20, 60);
    
    // Status
    pdf.setFontSize(14);
    pdf.setTextColor(appointment.status === 'Booked' ? 0 : appointment.status === 'Completed' ? 0 : 255, 
                      appointment.status === 'Booked' ? 100 : appointment.status === 'Completed' ? 150 : 0, 
                      appointment.status === 'Booked' ? 200 : appointment.status === 'Completed' ? 0 : 0);
    pdf.text(`Status: ${appointment.status}`, 20, 80);
    
    // Appointment Details
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('APPOINTMENT DETAILS', 20, 100);
    
    pdf.setFontSize(12);
    pdf.text(`Type: ${appointment.appointmentType}`, 20, 120);
    pdf.text(`Date: ${formatDate(appointment.appointmentSlot.date)}`, 20, 130);
    pdf.text(`Time: ${formatTime(appointment.appointmentSlot.startTime)} - ${formatTime(appointment.appointmentSlot.endTime)}`, 20, 140);
    pdf.text(`Duration: ${appointment.hoursConsumed} hours`, 20, 150);
    pdf.text(`Location: ${appointment.appointmentSlot.location || 'To be determined'}`, 20, 160);
    
    // Payment Details
    pdf.text('PAYMENT DETAILS', 20, 180);
    pdf.text(`Amount Paid: $${appointment.amountPaid}`, 20, 200);
    
    // Permit Details
    pdf.text('PERMIT INFORMATION', 20, 220);
    pdf.text(`Permit Number: ${appointment.permitNumber}`, 20, 240);
    pdf.text(`Issue Date: ${new Date(appointment.learnerPermitIssueDate).toLocaleDateString()}`, 20, 250);
    pdf.text(`Expiration Date: ${new Date(appointment.permitExpirationDate).toLocaleDateString()}`, 20, 260);
    pdf.text(`Driving Experience: ${appointment.drivingExperience}`, 20, 270);
    
    // Notes
    if (appointment.note) {
      pdf.text('NOTES', 20, 290);
      pdf.text(appointment.note, 20, 300);
    }
    
    pdf.save(`appointment-${appointment.id}.pdf`);
  };

  if (appointmentsLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="text-lg font-medium text-muted-foreground">Loading your appointments...</div>
=======
const AppointmentsSection = ({ 
  appointments = [], 
  appointmentsLoading, 
  appointmentsError 
}: AppointmentsSectionProps) => {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Validate appointments data
  const validAppointments = Array.isArray(appointments) 
    ? appointments.filter(apt => apt && apt.appointmentSlot) 
    : [];

  const getStatusConfig = (status: string) => {
    const configs = {
      'Booked': { 
        color: 'bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-600', 
        icon: CheckCircle, 
        iconColor: 'text-blue-500 dark:text-blue-400' 
      },
      'Completed': { 
        color: 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-600', 
        icon: CheckCircle, 
        iconColor: 'text-green-500 dark:text-green-400' 
      },
      'Cancelled': { 
        color: 'bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-600', 
        icon: XCircle, 
        iconColor: 'text-red-500 dark:text-red-400' 
      },
      'Pending': { 
        color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-600', 
        icon: AlertCircle, 
        iconColor: 'text-yellow-500 dark:text-yellow-400' 
      }
    };
    return configs[status as keyof typeof configs] || configs['Pending'];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const downloadPDF = (appointment: AppointmentType) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(59, 130, 246);
    pdf.text('DRIVING SCHOOL APPOINTMENT SLIP', 20, 30);
    
    // Appointment ID
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Appointment ID: #${appointment.id}`, 20, 50);
    pdf.text(`Booking Date: ${new Date(appointment.createdAt).toLocaleDateString()}`, 20, 60);
    
    // Status
    pdf.setFontSize(14);
    pdf.setTextColor(appointment.status === 'Booked' ? 0 : appointment.status === 'Completed' ? 0 : 255, 
                      appointment.status === 'Booked' ? 100 : appointment.status === 'Completed' ? 150 : 0, 
                      appointment.status === 'Booked' ? 200 : appointment.status === 'Completed' ? 0 : 0);
    pdf.text(`Status: ${appointment.status}`, 20, 80);
    
    // Appointment Details
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('APPOINTMENT DETAILS', 20, 100);
    
    pdf.setFontSize(12);
    pdf.text(`Type: ${appointment.appointmentType}`, 20, 120);
    pdf.text(`Date: ${formatDate(appointment.appointmentSlot.date)}`, 20, 130);
    pdf.text(`Time: ${formatTime(appointment.appointmentSlot.startTime)} - ${formatTime(appointment.appointmentSlot.endTime)}`, 20, 140);
    pdf.text(`Duration: ${appointment.hoursConsumed} hours`, 20, 150);
    pdf.text(`Location: ${appointment.appointmentSlot.location || 'To be determined'}`, 20, 160);
    
    // Payment Details
    pdf.text('PAYMENT DETAILS', 20, 180);
    pdf.text(`Amount Paid: $${appointment.amountPaid}`, 20, 200);
    
    // Permit Details
    pdf.text('PERMIT INFORMATION', 20, 220);
    pdf.text(`Permit Number: ${appointment.permitNumber}`, 20, 240);
    pdf.text(`Issue Date: ${new Date(appointment.learnerPermitIssueDate).toLocaleDateString()}`, 20, 250);
    pdf.text(`Expiration Date: ${new Date(appointment.permitExpirationDate).toLocaleDateString()}`, 20, 260);
    pdf.text(`Driving Experience: ${appointment.drivingExperience}`, 20, 270);
    
    // Notes
    if (appointment.note) {
      pdf.text('NOTES', 20, 290);
      pdf.text(appointment.note, 20, 300);
    }
    
    pdf.save(`appointment-${appointment.id}.pdf`);
  };

  if (appointmentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium">Loading appointments...</div>
>>>>>>> 82e036b (feat: enhence learner profile)
      </div>
    );
  }

  if (appointmentsError) {
<<<<<<< HEAD
    // Handle the specific case when user has no appointments (404 error)
    if (appointmentsError.includes('404') || appointmentsError.includes('No appointments found')) {
      return (
        <div className="space-y-8">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-2">My Appointments 📅</h2>
                  <p className="text-blue-100 text-lg">Manage your driving lessons and sessions</p>
                </div>
                <Button 
                  onClick={() => window.location.href = "/appointments"}
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </div>
            </div>
          </div>

          {/* No Appointments Message */}
          <Card className="p-16 text-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
            <Calendar className="h-16 w-16 text-blue-400 dark:text-blue-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">No Appointments Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You haven't booked any driving lessons yet. Start your driving journey by scheduling your first appointment!
            </p>
            <Button 
              onClick={() => window.location.href = "/appointments"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Book Your First Lesson
            </Button>
          </Card>
        </div>
      );
    }

    // Handle other errors
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <div className="text-lg font-medium text-red-500">Error loading appointments</div>
        <div className="text-sm text-muted-foreground">{appointmentsError}</div>
=======
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-red-500">Error loading appointments: {appointmentsError}</div>
>>>>>>> 82e036b (feat: enhence learner profile)
      </div>
    );
  }

  const now = new Date();
<<<<<<< HEAD
  const upcomingAppointments = validAppointments.filter(
    apt => apt?.appointmentSlot?.date && 
           apt.status !== 'Cancelled' && 
           new Date(apt.appointmentSlot.date) >= now
  );
  const pastAppointments = validAppointments.filter(
    apt => apt?.appointmentSlot?.date && (
           apt.status === 'Cancelled' || 
           new Date(apt.appointmentSlot.date) < now
    )
  );

  const AppointmentCard = ({ appointment }: { appointment: AppointmentType }) => {
    // Safety check for appointment data
    if (!appointment || !appointment.appointmentSlot) {
      return (
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Appointment data unavailable</p>
          </div>
        </Card>
      );
    }

    const statusConfig = getStatusConfig(appointment.status);
    const StatusIcon = statusConfig.icon;

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-700 dark:border-l-blue-400">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{appointment.appointmentType}</h3>
                <Badge className={`${statusConfig.color} border text-xs`}>
                  <StatusIcon className={`h-3 w-3 mr-1 ${statusConfig.iconColor}`} />
                  {appointment.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Appointment #{appointment.id}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${appointment.amountPaid || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{appointment.hoursConsumed || 0}h session</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CalendarDays className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                <span className="text-xs font-medium">
                  {appointment.appointmentSlot?.date ? formatDate(appointment.appointmentSlot.date) : 'Date TBD'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Clock className="h-3 w-3 text-green-500 dark:text-green-400" />
                <span className="text-xs">
                  {appointment.appointmentSlot?.startTime && appointment.appointmentSlot?.endTime 
                    ? `${formatTime(appointment.appointmentSlot.startTime)} - ${formatTime(appointment.appointmentSlot.endTime)}`
                    : 'Time TBD'
                  }
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-3 w-3 text-red-500 dark:text-red-400" />
                <span className="text-xs">{appointment.appointmentSlot?.location || 'Location TBD'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Timer className="h-3 w-3 text-purple-500 dark:text-purple-400" />
                <span className="text-xs">Duration: {appointment.hoursConsumed || 0} hours</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedAppointment(appointment);
                setIsDetailModalOpen(true);
              }}
              className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs py-1.5 h-auto"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadPDF(appointment)}
              className="flex-1 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs py-1.5 h-auto"
            >
              <Download className="h-3 w-3 mr-1" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Appointments</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{validAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Upcoming</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{upcomingAppointments.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Hours</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {validAppointments.reduce((sum, apt) => sum + (apt.hoursConsumed || 0), 0)}h
                </p>
              </div>
              <Timer className="h-8 w-8 text-purple-500 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  ${validAppointments.reduce((sum, apt) => sum + (apt.amountPaid || 0), 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-1/2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            History ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No upcoming appointments</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Book your next driving lesson to continue your progress</p>
              <Button onClick={() => window.location.href = "/appointments"}>
                <Plus className="h-4 w-4 mr-2" />
                Book New Appointment
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No appointment history</h3>
              <p className="text-gray-500 dark:text-gray-400">Your completed and past appointments will appear here</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Appointment Details Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
=======
  const upcomingAppointments = appointments.filter(
    apt => apt.status !== 'cancelled' && new Date(apt.date) >= now
  );
  const pastAppointments = validAppointments.filter(
    apt => apt?.appointmentSlot?.date && (
           apt.status === 'Cancelled' || 
           new Date(apt.appointmentSlot.date) < now
    )
  );

  const AppointmentCard = ({ appointment }: { appointment: AppointmentType }) => {
    // Safety check for appointment data
    if (!appointment || !appointment.appointmentSlot) {
      return (
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Appointment data unavailable</p>
          </div>
        </Card>
      );
    }

    const statusConfig = getStatusConfig(appointment.status);
    const StatusIcon = statusConfig.icon;

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-700 dark:border-l-blue-400">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{appointment.appointmentType}</h3>
                <Badge className={`${statusConfig.color} border text-xs`}>
                  <StatusIcon className={`h-3 w-3 mr-1 ${statusConfig.iconColor}`} />
                  {appointment.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Appointment #{appointment.id}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${appointment.amountPaid || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{appointment.hoursConsumed || 0}h session</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CalendarDays className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                <span className="text-xs font-medium">
                  {appointment.appointmentSlot?.date ? formatDate(appointment.appointmentSlot.date) : 'Date TBD'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Clock className="h-3 w-3 text-green-500 dark:text-green-400" />
                <span className="text-xs">
                  {appointment.appointmentSlot?.startTime && appointment.appointmentSlot?.endTime 
                    ? `${formatTime(appointment.appointmentSlot.startTime)} - ${formatTime(appointment.appointmentSlot.endTime)}`
                    : 'Time TBD'
                  }
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-3 w-3 text-red-500 dark:text-red-400" />
                <span className="text-xs">{appointment.appointmentSlot?.location || 'Location TBD'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Timer className="h-3 w-3 text-purple-500 dark:text-purple-400" />
                <span className="text-xs">Duration: {appointment.hoursConsumed || 0} hours</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedAppointment(appointment);
                setIsDetailModalOpen(true);
              }}
              className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs py-1.5 h-auto"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadPDF(appointment)}
              className="flex-1 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs py-1.5 h-auto"
            >
              <Download className="h-3 w-3 mr-1" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">My Appointments 📅</h2>
              <p className="text-blue-100 text-lg">Manage your driving lessons and sessions</p>
            </div>
            <Button 
              onClick={() => window.location.href = "/appointments"}
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Appointments</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{validAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Upcoming</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{upcomingAppointments.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Hours</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {validAppointments.reduce((sum, apt) => sum + (apt.hoursConsumed || 0), 0)}h
                </p>
              </div>
              <Timer className="h-8 w-8 text-purple-500 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  ${validAppointments.reduce((sum, apt) => sum + (apt.amountPaid || 0), 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>
>>>>>>> 82e036b (feat: enhence learner profile)
    </div>
  );
};

export default AppointmentsSection;