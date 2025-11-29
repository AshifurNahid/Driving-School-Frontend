import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, parse } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  DollarSign,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronDown,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import BookingModal from '@/components/appointments/BookingModal';
import BookingStatusModal from '@/components/appointments/BookingStatusModal';
import GuestBookingModal from '@/components/appointments/GuestBookingModal';
import {
  BookDirectAppointmentPayload,
  BookGuestAppointmentPayload,
  bookDirectAppointment,
  bookDirectAppointmentReset,
  bookGuestAppointment,
  bookGuestAppointmentReset,
  getAppointmentSlotsByDate
} from '@/redux/actions/appointmentAction';
import { AppointmentSlot } from '@/redux/reducers/appointmentReducer';

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

const friendlyDate = (date?: Date) =>
  date ? format(date, 'EEEE, MMMM dd, yyyy') : 'Select a date';

const formatTimeRange = (start: string, end: string) => {
  const startDate = parse(start, 'HH:mm:ss', new Date());
  const endDate = parse(end, 'HH:mm:ss', new Date());
  return `${format(startDate, 'h:mm a')} – ${format(endDate, 'h:mm a')}`;
};

interface DateSelectorProps {
  selectedDate?: Date;
  onSelect: (date: Date | undefined) => void;
  showPicker: boolean;
  onToggle: (open: boolean) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onSelect, showPicker, onToggle }) => (
  <Card className="shadow-sm border border-border/60 bg-card">
    <CardHeader className="border-b border-border/60 bg-muted/40">
      <CardTitle className="text-lg font-semibold flex items-center gap-3">
        <CalendarIcon className="h-5 w-5" />
        Select a date
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-4">
        <Popover open={showPicker} onOpenChange={onToggle}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-14 justify-between rounded-lg border-border/70 bg-background/80"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Selected date</p>
                  <p className="font-semibold">{friendlyDate(selectedDate)}</p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${showPicker ? 'rotate-180' : ''}`} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-3 bg-card border border-border/70 shadow-lg rounded-xl" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onSelect(date ?? undefined);
                onToggle(false);
              }}
              disabled={(date) => date < new Date()}
              className="rounded-lg"
              classNames={{
                day_selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
                day_today: 'bg-muted text-foreground font-semibold',
                day: 'hover:bg-muted/70 rounded-md'
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </CardContent>
  </Card>
);

interface TimeSlotCardProps {
  slot: AppointmentSlot;
  selected?: boolean;
  onSelect: (slot: AppointmentSlot) => void;
}

const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ slot, selected, onSelect }) => {
  const range = formatTimeRange(slot.startTime, slot.endTime);
  return (
    <button
      onClick={() => onSelect(slot)}
      className={`w-full text-left rounded-2xl border p-6 transition-all duration-200 shadow-sm bg-card border-border/70 hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40 ${
        selected ? 'border-primary ring-2 ring-primary/40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="text-base font-semibold">{range}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          Available
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-md bg-muted/60">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-medium leading-relaxed">
              {slot.location ? slot.location : 'Location will be provided'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-md bg-muted/60">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-sm font-semibold">${slot.pricePerSlot} per session</p>
          </div>
        </div>
      </div>
    </button>
  );
};

interface BookingSummaryProps {
  selectedDate?: Date;
  selectedSlot?: AppointmentSlot | null;
  onRequest: () => void;
  loading: boolean;
  className?: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedDate,
  selectedSlot,
  onRequest,
  loading,
  className = ''
}) => (
  <Card className={`shadow-sm border border-border/60 bg-card h-full ${className}`}>
    <CardHeader className="border-b border-border/60 bg-muted/40">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold">
        <Sparkles className="h-5 w-5 text-primary" />
        Session summary
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 space-y-4">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Date</p>
        <p className="font-semibold">{friendlyDate(selectedDate)}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Time</p>
        <p className="font-semibold">
          {selectedSlot ? formatTimeRange(selectedSlot.startTime, selectedSlot.endTime) : 'Select a slot'}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Price</p>
        <p className="font-semibold">
          {selectedSlot ? `$${selectedSlot.pricePerSlot} per session` : 'Choose a slot to view price'}
        </p>
      </div>

      <Button
        onClick={onRequest}
        disabled={!selectedSlot || loading}
        className="w-full h-12 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            Request In-Car Session
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </CardContent>
  </Card>
);

const UserAppointment: React.FC = () => {
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isGuestBookingModalOpen, setIsGuestBookingModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!userInfo;

  const {
    loading: slotsLoading,
    appointmentSlots: slots,
    error: slotsError
  } = useSelector((state: RootState) => state.appointmentSlots);

  const {
    loading: bookingLoading = false,
    success: bookingSuccess = false,
    message: bookingMessage = null,
    error: bookingError = null,
    data: bookingData = null
  } = useSelector((state: RootState) => state.bookDirectAppointment ?? {
    loading: false,
    success: false,
    message: null,
    error: null,
    data: null
  });

  const {
    loading: guestBookingLoading = false,
    success: guestBookingSuccess = false,
    message: guestBookingMessage = null,
    error: guestBookingError = null,
    data: guestBookingData = null
  } = useSelector((state: RootState) => state.bookGuestAppointment ?? {
    loading: false,
    success: false,
    message: null,
    error: null,
    data: null
  });

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    dispatch(getAppointmentSlotsByDate(dateStr) as any);
  }, [dispatch, selectedDate]);

  useEffect(() => {
    if (bookingSuccess || bookingError) {
      setIsBookingModalOpen(false);
      setIsStatusModalOpen(true);

      if (bookingSuccess && selectedDate) {
        dispatch(getAppointmentSlotsByDate(format(selectedDate, 'yyyy-MM-dd')) as any);
      }
    }
  }, [bookingSuccess, bookingError, dispatch, selectedDate]);

  useEffect(() => {
    if (guestBookingSuccess || guestBookingError) {
      setIsGuestBookingModalOpen(false);
      setIsStatusModalOpen(true);

      if (guestBookingSuccess && selectedDate) {
        dispatch(getAppointmentSlotsByDate(format(selectedDate, 'yyyy-MM-dd')) as any);
      }
    }
  }, [guestBookingSuccess, guestBookingError, dispatch, selectedDate]);

  const availableSlots = useMemo(
    () =>
      slots.filter(
        (slot) =>
          slot.status === 1 &&
          !slot.isBooked &&
          slot.pricePerSlot !== undefined &&
          slot.pricePerSlot !== null &&
          slot.pricePerSlot > 0
      ),
    [slots]
  );

  const handleSelectSlot = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
  };

  const handleRequest = () => {
    if (!selectedSlot) return;
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
    dispatch(bookDirectAppointmentReset());
  };

  const handleCloseGuestModal = () => {
    setIsGuestBookingModalOpen(false);
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

  const loadingState = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="h-40 rounded-xl border border-border/60 bg-muted/50 animate-pulse"
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 text-foreground">
      <RoleBasedNavigation />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12">
        <header className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Book In-Car Session
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Book In-Car Session</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Choose a date and pick an available time slot for your driving lesson. Fast, clear, and modern booking experience.
          </p>
        </header>

        <div className="grid items-start lg:grid-cols-[320px_minmax(0,1.4fr)] xl:grid-cols-[340px_minmax(0,1.8fr)_340px] gap-6 xl:gap-6 2xl:gap-8">
          <DateSelector
            selectedDate={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date ?? undefined);
              setSelectedSlot(null);
            }}
            showPicker={showDatePicker}
            onToggle={(open) => setShowDatePicker(open)}
          />

          <div className="space-y-6 lg:space-y-5">
            <Card className="shadow-sm border border-border/60 bg-card">
              <CardHeader className="border-b border-border/60 bg-muted/40 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" />
                  <CardTitle className="text-lg font-semibold">Available slots</CardTitle>
                </div>
                {selectedDate && (
                  <p className="text-sm text-muted-foreground">{friendlyDate(selectedDate)}</p>
                )}
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {slotsLoading ? (
                  loadingState
                ) : slotsError ? (
                  <div className="text-center py-12 space-y-3">
                    <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
                    <p className="text-lg font-semibold">Unable to load appointments</p>
                    <p className="text-muted-foreground">{slotsError}</p>
                    <Button
                      variant="outline"
                      onClick={() =>
                        selectedDate && dispatch(getAppointmentSlotsByDate(format(selectedDate, 'yyyy-MM-dd')) as any)
                      }
                    >
                      Try again
                    </Button>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-lg font-semibold">No available slots for this date.</p>
                    <p className="text-muted-foreground">Please choose another date.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
                    {availableSlots.map((slot) => (
                      <TimeSlotCard
                        key={slot.id}
                        slot={slot}
                        selected={selectedSlot?.id === slot.id}
                        onSelect={handleSelectSlot}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="xl:hidden">
              <BookingSummary
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onRequest={handleRequest}
                loading={bookingLoading || guestBookingLoading}
              />
            </div>
          </div>

          <div className="hidden xl:block">
            <BookingSummary
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onRequest={handleRequest}
              loading={bookingLoading || guestBookingLoading}
              className="sticky top-24"
            />
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleBookingSubmit}
        slot={selectedSlot}
        loading={bookingLoading}
      />

      <GuestBookingModal
        isOpen={isGuestBookingModalOpen}
        onClose={handleCloseGuestModal}
        onSubmit={handleGuestBookingSubmit}
        slot={selectedSlot}
        loading={guestBookingLoading}
      />

      <BookingStatusModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        success={bookingSuccess || guestBookingSuccess}
        message={
          guestBookingSuccess
            ? 'Appointment booked successfully and your account has been created!'
            : bookingMessage || (bookingSuccess ? 'Appointment booked successfully!' : 'Booking failed')
        }
        errorMessage={guestBookingError || bookingError}
        appointmentData={
          guestBookingData ||
          bookingData ||
          (selectedSlot
            ? {
                id: 0,
                status: 'Booking...',
                createdAt: new Date().toISOString(),
                appointmentSlot: {
                  date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
                  startTime: selectedSlot?.startTime || '',
                  endTime: selectedSlot?.endTime || '',
                  location: selectedSlot?.location || 'Location will be provided',
                  price: selectedSlot?.pricePerSlot || 0
                }
              }
            : null)
        }
      />
    </div>
  );
};

export default UserAppointment;
