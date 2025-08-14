import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CreditCard,
  FileText,
  Download,
  Timer,
  CalendarDays,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';

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

interface AppointmentDetailModalProps {
  appointment: AppointmentType | null;
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  isOpen,
  onClose
}) => {
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
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Professional Colors - More conservative palette
    const primaryColor: [number, number, number] = [37, 99, 235]; // Professional Blue
    const secondaryColor: [number, number, number] = [75, 85, 99]; // Professional Gray
    const accentColor: [number, number, number] = [34, 197, 94]; // Professional Green
    const textColor: [number, number, number] = [31, 41, 55]; // Dark gray
    
    // Header Background
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    // School Logo/Name Area
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NL DRIVER\'S ACADEMY', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Professional Driving Education', 20, 35);
    
    // Contact Info (Right aligned)
    pdf.setFontSize(10);
    pdf.text('+1 (709) 351-6738', pageWidth - 70, 25);
    pdf.text('info@nldriversacademy.ca', pageWidth - 70, 32);
    
    // Document Title
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('APPOINTMENT CONFIRMATION SLIP', 20, 70);
    
    // Appointment ID Box
    pdf.setFillColor(240, 242, 247);
    pdf.rect(15, 80, pageWidth - 30, 25, 'F');
    pdf.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.rect(15, 80, pageWidth - 30, 25, 'S');
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Appointment #${appointment.id}`, 20, 92);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 20, 100);
    
    // Simple Status Text (Right aligned)
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Status: ${appointment.status.toUpperCase()}`, pageWidth - 85, 95);
    
    // Student Information Section
    let yPos = 125;
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STUDENT INFORMATION', 20, yPos + 6);
    
    yPos += 20;
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    // Two column layout
    const col1X = 20;
    const col2X = pageWidth / 2 + 10;
    
    pdf.text('Student ID:', col1X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${appointment.userId}`, col1X + 35, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Booking Date:', col2X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(new Date(appointment.createdAt).toLocaleDateString('en-US'), col2X + 40, yPos);
    
    // Appointment Details Section
    yPos += 25;
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('APPOINTMENT DETAILS', 20, yPos + 6);
    
    yPos += 20;
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    pdf.text('Lesson Type:', col1X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(appointment.appointmentType, col1X + 35, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Duration:', col2X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${appointment.hoursConsumed} hours`, col2X + 30, yPos);
    
    yPos += 12;
    pdf.setFont('helvetica', 'normal');
    pdf.text('Date:', col1X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(formatDate(appointment.appointmentSlot.date), col1X + 35, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Instructor ID:', col2X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${appointment.appointmentSlot.instructorId}`, col2X + 40, yPos);
    
    yPos += 12;
    pdf.setFont('helvetica', 'normal');
    pdf.text('Time:', col1X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${formatTime(appointment.appointmentSlot.startTime)} - ${formatTime(appointment.appointmentSlot.endTime)}`, col1X + 35, yPos);
    
    yPos += 12;
    pdf.setFont('helvetica', 'normal');
    pdf.text('Location:', col1X, yPos);
    pdf.setFont('helvetica', 'bold');
    const locationText = appointment.appointmentSlot.location || 'Main Campus - 123 Driving St.';
    pdf.text(locationText, col1X + 35, yPos);
    
    // Payment Information Section
    yPos += 25;
    pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT INFORMATION', 20, yPos + 6);
    
    yPos += 20;
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    pdf.text('Amount Paid:', col1X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.setFontSize(14);
    pdf.text(`$${appointment.amountPaid}`, col1X + 40, yPos);
    
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Payment Status:', col2X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONFIRMED', col2X + 45, yPos);
    
    // Permit Information Section
    yPos += 25;
    pdf.setFillColor(251, 146, 60); // Professional Orange
    pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LEARNER PERMIT DETAILS', 20, yPos + 6);
    
    yPos += 20;
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    pdf.text('Permit Number:', col1X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(appointment.permitNumber, col1X + 45, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Issue Date:', col2X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(new Date(appointment.learnerPermitIssueDate).toLocaleDateString('en-US'), col2X + 35, yPos);
    
    yPos += 12;
    pdf.setFont('helvetica', 'normal');
    pdf.text('Expiration Date:', col1X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(new Date(appointment.permitExpirationDate).toLocaleDateString('en-US'), col1X + 45, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Foreign License:', col2X, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(appointment.isLicenceFromAnotherCountry ? 'YES' : 'NO', col2X + 45, yPos);
    
    // Experience and Notes Section
    if (appointment.drivingExperience || appointment.note) {
      yPos += 25;
      pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ADDITIONAL INFORMATION', 20, yPos + 6);
      
      yPos += 20;
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      if (appointment.drivingExperience) {
        pdf.text('Driving Experience:', col1X, yPos);
        yPos += 8;
        const experienceLines = pdf.splitTextToSize(appointment.drivingExperience, pageWidth - 40);
        pdf.text(experienceLines, col1X, yPos);
        yPos += experienceLines.length * 5 + 10;
      }
      
      if (appointment.note) {
        pdf.text('Special Notes:', col1X, yPos);
        yPos += 8;
        const noteLines = pdf.splitTextToSize(appointment.note, pageWidth - 40);
        pdf.text(noteLines, col1X, yPos);
        yPos += noteLines.length * 5;
      }
    }
    
    // Important Instructions Box
    yPos += 20;
    pdf.setFillColor(254, 242, 242); // Light red background
    pdf.setDrawColor(220, 38, 38);   // Professional red border
    pdf.rect(15, yPos, pageWidth - 30, 35, 'FD');
    
    pdf.setTextColor(153, 27, 27);   // Professional dark red text
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('IMPORTANT INSTRUCTIONS', 20, yPos + 10);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('• Please arrive 15 minutes before your scheduled time', 20, yPos + 18);
    pdf.text('• Bring your learner permit and a valid photo ID', 20, yPos + 24);
    pdf.text('• Wear comfortable clothing and closed-toe shoes', 20, yPos + 30);
    
    // Footer
    const footerY = pageHeight - 30;
    pdf.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.line(20, footerY, pageWidth - 20, footerY);
    
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.text('This is an official appointment confirmation. Please keep this document for your records.', 20, footerY + 10);
    pdf.text(`Document generated on ${new Date().toLocaleString('en-US')}`, 20, footerY + 18);
    
    // Save the PDF
    pdf.save(`nl-drivers-academy-appointment-${appointment.id}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-gray-900 dark:text-gray-100">
            <Calendar className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                Basic Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Appointment ID:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">#{appointment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{appointment.appointmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge className={getStatusConfig(appointment.status).color}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Booking Date:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(appointment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Clock className="h-5 w-5 text-green-500 dark:text-green-400" />
                Schedule Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(appointment.appointmentSlot.date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatTime(appointment.appointmentSlot.startTime)} - 
                    {formatTime(appointment.appointmentSlot.endTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{appointment.hoursConsumed} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {appointment.appointmentSlot.location || 'To be determined'}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment and Permit Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <CreditCard className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                Payment Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                    ${appointment.amountPaid}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Per Slot Price:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${appointment.appointmentSlot.pricePerSlot}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <FileText className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                Permit Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Permit Number:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{appointment.permitNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Issue Date:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(appointment.learnerPermitIssueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Expiration:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(appointment.permitExpirationDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Foreign License:</span>
                  <Badge variant={appointment.isLicenceFromAnotherCountry ? "default" : "secondary"}>
                    {appointment.isLicenceFromAnotherCountry ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Experience and Notes */}
          <Card className="p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <User className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Driving Experience:</h4>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {appointment.drivingExperience}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Notes:</h4>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {appointment.note || 'No additional notes'}
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => downloadPDF(appointment)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF Slip
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailModal;
