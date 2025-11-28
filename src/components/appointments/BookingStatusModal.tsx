// Fixed BookingStatusModal.tsx

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Calendar, Clock, User, MapPin, AlertCircle, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface BookingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message: string | null;
  errorMessage?: string | null;
  appointmentData?: {
    id: number;
    status: string;
    createdAt: string;
    appointmentSlot?: {
      date: string;
      startTime: string;
      endTime: string;
      instructorId?: number;
      instructorName?: string;
      location?: string;
      price?: number;
    } | null;
  } | null;
}

const BookingStatusModal: React.FC<BookingStatusModalProps> = ({
  isOpen,
  onClose,
  success,
  message,
  errorMessage,
  appointmentData
}) => {
  // Add console logs to debug the component
  React.useEffect(() => {
    if (isOpen) {
      console.log("BookingStatusModal opened with props:", {
        isOpen,
        success,
        message,
        errorMessage,
        appointmentData
      });
    }
  }, [isOpen, success, message, errorMessage, appointmentData]);
  
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      console.warn("Date formatting error:", error);
      return dateString;
    }
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return "TBD";

    try {
      if (timeString.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
        const [hours, minutes] = timeString.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
      return timeString;
    } catch (error) {
      console.warn("Time formatting error:", error);
      return timeString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold flex items-center gap-2 ${success ? 'text-green-600' : 'text-red-600'}`}>
            {success ? (
              <>
                <CheckCircle className="h-6 w-6" />
                Booking Successful!
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6" />
                Booking Failed
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            {success 
              ? (message || 'Your appointment has been booked successfully!')
              : (errorMessage || message || 'There was an error booking your appointment.')
            }
          </DialogDescription>
        </DialogHeader>

        {success && appointmentData ? (
          <div className="my-4 space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-3">Appointment Details</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span><strong>Booking ID:</strong> #{appointmentData.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span><strong>Status:</strong> {appointmentData.status || "Confirmed"}</span>
                </div>
                
                {/* Show appointment slot details if available */}
                {appointmentData.appointmentSlot ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span><strong>Date:</strong> {formatDate(appointmentData.appointmentSlot.date)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>
                        <strong>Time:</strong> {formatTime(appointmentData.appointmentSlot.startTime)} - {formatTime(appointmentData.appointmentSlot.endTime)}
                      </span>
                    </div>
                    {appointmentData.appointmentSlot.instructorName && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span><strong>Instructor:</strong> {appointmentData.appointmentSlot.instructorName}</span>
                      </div>
                    )}
                    {appointmentData.appointmentSlot.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span><strong>Location:</strong> {appointmentData.appointmentSlot.location}</span>
                      </div>
                    )}
                    
                    {/* Show price information if available */}
                    {(appointmentData.appointmentSlot as any)?.price > 0 && (
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span><strong>Amount Paid:</strong> ${(appointmentData.appointmentSlot as any)?.price}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-amber-700">
                      <strong>Note:</strong> Additional appointment details will be available in your dashboard shortly.
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span><strong>Booked:</strong> {formatDate(appointmentData.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                📱 You can view and manage all your appointments in your profile dashboard.
              </p>
              <p className="text-xs text-gray-500">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </div>
        ) : !success ? (
          <div className="my-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                What went wrong?
              </h3>
              <p className="text-sm text-red-600 mb-3">
                {errorMessage || "An unexpected error occurred while processing your booking."}
              </p>
              <div className="text-xs text-red-500">
                • The time slot may have been booked by another user
                • There may be a temporary server issue
                • Please check your internet connection
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Please try selecting a different appointment slot or try again in a few moments.
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button 
            onClick={() => {
              if (success) {
                // First close the modal
                onClose();
                // Then redirect to learner profile page
                setTimeout(() => {
                  window.location.href = '/learner/profile';
                }, 100);
              } else {
                onClose();
              }
            }}
            className={success 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          >
            {success ? 'Continue to Dashboard' : 'Try Again'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingStatusModal;