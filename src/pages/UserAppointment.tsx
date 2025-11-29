// Professional redesigned UserAppointment.tsx with Compact Slots

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
  Loader2,
  ChevronDown,
  Award,
  Shield,
  Phone,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import BookingModal from '@/components/appointments/BookingModal';
import BookingStatusModal from '@/components/appointments/BookingStatusModal';
import GuestBookingModal from '@/components/appointments/GuestBookingModal';
import { 
  getAppointmentSlotsByDate,
  bookDirectAppointment,
  bookDirectAppointmentReset,
  BookDirectAppointmentPayload,
  bookGuestAppointment,
  bookGuestAppointmentReset,
  BookGuestAppointmentPayload
} from '@/redux/actions/appointmentAction';
import { AppointmentSlot } from '@/redux/reducers/appointmentReducer';

// Define RootState type - adjust according to your store structure
interface RootState {
  auth: {
    loading: boolean;
    userInfo: any | null;
    error?: string | null;
  };
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
  bookGuestAppointment: {
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
  const [isGuestBookingModalOpen, setIsGuestBookingModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Redux state
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!userInfo;
  
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

  const defaultGuestAppointment = {
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
  
  const {
    loading: guestBookingLoading = false,
    success: guestBookingSuccess = false,
    message: guestBookingMessage = null,
    error: guestBookingError = null,
    data: guestBookingData = null
  } = useSelector((state: RootState) =>
    state.bookGuestAppointment ?? defaultGuestAppointment
  );

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    dispatch(getAppointmentSlotsByDate(dateStr) as any);
  }, [selectedDate, dispatch]);

  // Handle booking success/error
  useEffect(() => {
    if (bookingSuccess || bookingError) {
      setIsBookingModalOpen(false);
      setIsStatusModalOpen(true);
      
      if (bookingSuccess && selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        dispatch(getAppointmentSlotsByDate(dateStr) as any);
      }
    }
  }, [bookingSuccess, bookingError, dispatch, selectedDate]);
  
  // Handle guest booking success/error
  useEffect(() => {
    if (guestBookingSuccess || guestBookingError) {
      setIsGuestBookingModalOpen(false);
      setIsStatusModalOpen(true);
      
      if (guestBookingSuccess && selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        dispatch(getAppointmentSlotsByDate(dateStr) as any);
      }
    }
  }, [guestBookingSuccess, guestBookingError, dispatch, selectedDate]);

  const handleBookNow = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
    
    if (isAuthenticated) {
      dispatch(bookDirectAppointmentReset());
      setIsBookingModalOpen(true);
    } else {
      dispatch(bookGuestAppointmentReset());
      setIsGuestBookingModalOpen(true);
    }
  };

  const handleBookingSubmit = (payload: BookDirectAppointmentPayload) => {
    dispatch(bookDirectAppointment(payload) as any);
  };
  
  const handleGuestBookingSubmit = (payload: BookGuestAppointmentPayload) => {
    dispatch(bookGuestAppointment(payload) as any);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
    dispatch(bookDirectAppointmentReset());
  };
  
  const handleCloseGuestModal = () => {
    setIsGuestBookingModalOpen(false);
    setSelectedSlot(null);
    dispatch(bookGuestAppointmentReset());
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedSlot(null);
    if (guestBookingSuccess || guestBookingError) {
      dispatch(bookGuestAppointmentReset());
    } else {
      dispatch(bookDirectAppointmentReset());
    }
  };

  // Filter only available slots (status === 1) and slots with price available
  const availableSlots = slots.filter(slot => 
    slot.status === 1 && 
    slot.pricePerSlot !== undefined && 
    slot.pricePerSlot !== null && 
    slot.pricePerSlot > 0
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <RoleBasedNavigation />
      
      {/* Professional Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg mb-6">
              <CalendarIcon className="h-8 w-8 text-slate-700 dark:text-slate-300" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Driving Lesson Appointments
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Schedule your professional driving lessons with certified instructors. 
              Choose your preferred date and time slot below.
            </p>
          </div>

          {/* Why Booking Works - Inspired by the provided image */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="rounded-xl bg-slate-100 dark:bg-gray-800/95 backdrop-blur-md p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-gray-700/50 hover:transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-white dark:bg-teal-500/30 rounded-full flex items-center justify-center shadow-sm">
                    <CalendarIcon className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-block bg-teal-600 dark:bg-teal-500/20 text-white text-lg font-bold rounded-full w-6 h-6 flex items-center justify-center mb-2">1</div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Select Date</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Pick your preferred date from the calendar with available slots highlighted.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-xl bg-slate-100 dark:bg-gray-800/95 backdrop-blur-md p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-gray-700/50 hover:transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-white dark:bg-blue-500/30 rounded-full flex items-center justify-center shadow-sm">
                    <Clock className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-block bg-blue-600 dark:bg-blue-500/20 text-white text-lg font-bold rounded-full w-6 h-6 flex items-center justify-center mb-2">2</div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Choose Time</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Browse available time slots with instructor details and select your preferred option.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="rounded-xl bg-slate-100 dark:bg-gray-800/95 backdrop-blur-md p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-gray-700/50 hover:transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-white dark:bg-green-500/30 rounded-full flex items-center justify-center shadow-sm">
                    <ArrowRight className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-block bg-green-600 dark:bg-green-500/20 text-white text-lg font-bold rounded-full w-6 h-6 flex items-center justify-center mb-2">3</div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Confirm Booking</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Enter your permit details, confirm your selection, and receive instant confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Date Selection Section */}
        <Card className="mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <CalendarIcon className="h-5 w-5" />
              Select Appointment Date
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-w-md mx-auto">
              {/* Date Selector Button */}
              <Button
                variant="outline"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full h-14 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-lg justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    {selectedDate ? (
                      <>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Selected Date</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400">Choose appointment date</div>
                    )}
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
              </Button>

              {/* Calendar */}
              {showDatePicker && (
                <div className="mt-4">
                  <Card className="shadow-lg border border-gray-300 dark:border-gray-600">
                    <CardContent className="p-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setShowDatePicker(false);
                        }}
                        disabled={(date) => date < new Date()}
                        className="rounded-lg"
                        classNames={{
                          day_selected: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900",
                          day_today: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 font-semibold",
                          day: "hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Slots Section */}
        {selectedDate && (
          <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" />
                  Available Time Slots
                </div>
                {availableSlots.length > 0 && (
                  <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                    {availableSlots.length} available
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {slotsLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 text-gray-600 animate-spin mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Loading available appointments...</p>
                </div>
              ) : slotsError ? (
                <div className="text-center py-16">
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unable to load appointments</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{slotsError}</p>
                  <Button 
                    onClick={() => {
                      if (selectedDate) {
                        const dateStr = format(selectedDate, 'yyyy-MM-dd');
                        dispatch(getAppointmentSlotsByDate(dateStr) as any);
                      }
                    }}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    Retry
                  </Button>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No appointments available</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All time slots are booked for this date. Please select a different date.
                  </p>
                </div>
              ) : (
                // Compact Grid Layout for Multiple Slots
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableSlots.map((slot) => (
                    <Card key={slot.id} className="border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200 group">
                      <CardContent className="p-4">
                        {/* Time and Price Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                              <Clock className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                {slot.startTime} - {slot.endTime}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white text-lg">
                              ${slot.pricePerSlot || 25}
                            </div>
                          </div>
                        </div>

                        {/* Instructor and Location */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs">
                            <User className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300 truncate">
                              {slot.instructorName || `Instructor ${slot.instructorId}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs">
                            <MapPin className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300 truncate">
                              {slot.location || 'Driving School'}
                            </span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex items-center justify-center gap-4 mb-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <Award className="h-3 w-3 text-green-500" />
                            <span>Certified</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <Shield className="h-3 w-3 text-blue-500" />
                            <span>Insured</span>
                          </div>
                        </div>

                        {/* Book Button */}
                        <Button
                          onClick={() => handleBookNow(slot)}
                          disabled={bookingLoading && selectedSlot?.id === slot.id}
                          className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 h-9 text-sm group-hover:shadow-md transition-all"
                        >
                          {bookingLoading && selectedSlot?.id === slot.id ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-2" />
                              Booking...
                            </>
                          ) : (
                            <>
                              Book Now
                              <ArrowRight className="h-3 w-3 ml-2" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Statistics */}
        {selectedDate && !slotsLoading && availableSlots.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {availableSlots.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available Slots</div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  ${availableSlots.length > 0 
                    ? Math.min(...availableSlots.map(slot => slot.pricePerSlot || 25))
                    : 0
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Starting From</div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {new Set(availableSlots.map(slot => slot.instructorName || slot.instructorId)).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Instructors</div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Professional</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Booking Modal for Logged in Users */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleBookingSubmit}
        slot={selectedSlot}
        loading={bookingLoading}
      />
      
      {/* Guest Booking Modal for Non-Logged in Users */}
      <GuestBookingModal
        isOpen={isGuestBookingModalOpen}
        onClose={handleCloseGuestModal}
        onSubmit={handleGuestBookingSubmit}
        slot={selectedSlot}
        loading={guestBookingLoading}
      />

      {/* Booking Status Modal */}
      <BookingStatusModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        success={bookingSuccess || guestBookingSuccess}
        message={
          guestBookingSuccess 
            ? "Appointment booked successfully and your account has been created!" 
            : (bookingMessage || (bookingSuccess ? "Appointment booked successfully!" : "Booking failed"))
        }
        errorMessage={guestBookingError || bookingError}
        appointmentData={
          guestBookingData || bookingData || (selectedSlot ? {
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
          } : null)
        }
      />
    </div>
  );
};

export default UserAppointment;