// Fixed UserAppointment.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  BookOpen, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Loader2
} from 'lucide-react';
import { 
  getAppointmentSlotsByDate,
  bookDirectAppointment,
  bookDirectAppointmentReset,
  BookDirectAppointmentPayload
} from '@/redux/actions/appointmentAction';
import { AppointmentSlot } from '@/redux/reducers/appointmentReducer';
import BookingModal from '@/components/appointments/BookingModal';
import BookingStatusModal from '@/components/appointments/BookingStatusModal';

// Define RootState type - adjust according to your store structure
interface RootState {
  appointmentSlots: {
    loading: boolean;
    appointmentSlots: AppointmentSlot[];
    error: string | null;
  };
  bookDirectAppointment: {
    loading: boolean;
    success: boolean;
    message: string | null;
    error: string | null;
    data: any;
  };
}

const UserAppointment: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Redux state
  const { 
    loading: slotsLoading, 
    appointmentSlots: slots, 
    error: slotsError 
  } = useSelector((state: RootState) => state.appointmentSlots);

  const defaultBookDirectAppointment = {
    loading: false,
    success: false,
    message: null,
    error: null,
    data: null
  };

  const {
    loading: bookingLoading = false,
    success: bookingSuccess = false,
    message: bookingMessage = null,
    error: bookingError = null,
    data: bookingData = null
  } = useSelector((state: RootState) =>
    state.bookDirectAppointment ?? defaultBookDirectAppointment
  );

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    dispatch(getAppointmentSlotsByDate(dateStr) as any);
  }, [selectedDate, dispatch]);

  // Handle booking success/error - FIXED
  useEffect(() => {
    console.log("Booking state changed:", { 
      bookingSuccess, 
      bookingMessage, 
      bookingError, 
      bookingData 
    });

    // Show status modal when booking request completes (success or error)
    if (bookingSuccess || bookingError) {
      console.log("Showing status modal - success:", bookingSuccess, "error:", bookingError);
      setIsBookingModalOpen(false);
      setIsStatusModalOpen(true);
      
      // Refresh slots after successful booking
      if (bookingSuccess && selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        dispatch(getAppointmentSlotsByDate(dateStr) as any);
      }
    }
  }, [bookingSuccess, bookingError, dispatch, selectedDate]);

  const handleBookNow = (slot: AppointmentSlot) => {
    console.log("Book now clicked for slot:", slot);
    // Reset any existing state before opening the modal
    setSelectedSlot(slot);
    dispatch(bookDirectAppointmentReset()); // Reset any previous booking state
    setIsBookingModalOpen(true);
    console.log("Booking modal should now be open with fresh form");
  };

  const handleBookingSubmit = (payload: BookDirectAppointmentPayload) => {
    console.log('Submitting booking with payload:', payload);
    console.log('Selected slot:', selectedSlot);
    dispatch(bookDirectAppointment(payload) as any);
  };

  const handleCloseModal = () => {
    console.log("Closing booking modal");
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
    dispatch(bookDirectAppointmentReset());
  };

  const handleCloseStatusModal = () => {
    console.log("Closing status modal");
    setIsStatusModalOpen(false);
    setSelectedSlot(null);
    dispatch(bookDirectAppointmentReset());
  };

  // Filter only available slots (status === 1)
  const availableSlots = slots.filter(slot => slot.status === 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CalendarIcon className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
          <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-3">
            Book Your Driving Appointment
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Choose a date and select from available time slots with qualified instructors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Date Picker Card */}
          <Card className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-lg rounded-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
                <CalendarIcon className="h-6 w-6" />
                Select a Date
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-2xl border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-900 shadow-inner"
                  classNames={{
                    day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                    day_today: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                  }}
                />
              </div>
              {selectedDate && (
                <div className="mt-4 text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {format(selectedDate, 'EEEE')}
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-300">
                    {format(selectedDate, 'MMMM dd, yyyy')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Slots Card */}
          <Card className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-lg rounded-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
                <Clock className="h-6 w-6" />
                Available Slots
                {availableSlots.length > 0 && (
                  <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                    {availableSlots.length} available
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto">
                {slotsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
                      Loading available slots...
                    </p>
                  </div>
                ) : slotsError ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <XCircle className="h-12 w-12 text-red-500 mb-4" />
                    <p className="text-red-600 font-semibold text-lg mb-2">Error Loading Slots</p>
                    <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
                      {slotsError}
                    </p>
                    <Button 
                      onClick={() => {
                        if (selectedDate) {
                          const dateStr = format(selectedDate, 'yyyy-MM-dd');
                          dispatch(getAppointmentSlotsByDate(dateStr) as any);
                        }
                      }}
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 font-semibold text-lg mb-2">
                      No Available Slots
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                      There are no available appointment slots for the selected date. 
                      Please try selecting a different date.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-lg border border-green-200 dark:border-green-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-5 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 font-bold text-green-700 dark:text-green-300 text-lg">
                            <Clock className="h-5 w-5" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300">
                            <CheckCircle className="h-3 w-3" />
                            Available
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{slot.instructorName || `Instructor ${slot.instructorId}`}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span>{slot.location || 'Location TBD'}</span>
                          </div>
                          {slot.courseTitle && (
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                              <span>{slot.courseTitle}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              ${slot.pricePerSlot || 25}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleBookNow(slot)}
                            disabled={bookingLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                          >
                            {bookingLoading && selectedSlot?.id === slot.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Booking...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                Book Now 
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        {selectedDate && !slotsLoading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {availableSlots.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Available Slots
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${availableSlots.length > 0 
                    ? Math.min(...availableSlots.map(slot => slot.pricePerSlot || 25))
                    : 0
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Starting From
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {new Set(availableSlots.map(slot => slot.instructorName || slot.instructorId)).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Instructors Available
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleBookingSubmit}
        slot={selectedSlot}
        loading={bookingLoading}
      />

      {/* Booking Status Modal - FIXED */}
      <BookingStatusModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        success={bookingSuccess}
        message={bookingMessage || (bookingSuccess ? "Appointment booked successfully!" : "Booking failed")}
        errorMessage={bookingError}
        appointmentData={bookingData || (selectedSlot ? {
          id: 0,
          status: "Booking...",
          createdAt: new Date().toISOString(),
          appointmentSlot: {
            date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : "",
            startTime: selectedSlot?.startTime || "",
            endTime: selectedSlot?.endTime || "",
            instructorName: selectedSlot?.instructorName || `Instructor ${selectedSlot?.instructorId}`,
            location: selectedSlot?.location || "School Location",
            price: selectedSlot?.pricePerSlot || 0
          }
        } : null)}
      />
    </div>
  );
};

export default UserAppointment;