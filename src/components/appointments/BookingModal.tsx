import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { CalendarIcon, Clock, User, MapPin, DollarSign } from 'lucide-react';
import { AppointmentSlot } from '@/redux/reducers/appointmentReducer';
import { BookDirectAppointmentPayload } from '@/redux/actions/appointmentAction';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Badge } from '@/components/ui/badge';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: BookDirectAppointmentPayload) => void;
  slot: AppointmentSlot | null;
  loading: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  slot,
  loading
}) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userDetails = userInfo?.user_detail;

  // Initial empty form state
  const initialFormState = {
    note: '',
    learnerPermitIssueDate: undefined as Date | undefined,
    permitNumber: '',
    permitExpirationDate: undefined as Date | undefined,
    drivingExperience: '',
    isLicenceFromAnotherCountry: false
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const parseDate = useMemo(() => (value?: string | null) => {
    if (!value) return undefined;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, []);

  // Reset form when the modal opens or closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setErrors({});
      return;
    }

    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        learnerPermitIssueDate:
          prev.learnerPermitIssueDate || parseDate(userDetails.learners_permit_issue_date),
        drivingExperience: prev.drivingExperience || userDetails.driving_experience || '',
        isLicenceFromAnotherCountry:
          userDetails.has_foreign_driving_license ?? prev.isLicenceFromAnotherCountry,
      }));
    }
  }, [isOpen, userDetails, parseDate]);

  const calculateHoursToConsume = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.round(diffInHours * 100) / 100;
  };

  const formatTimeRange = (start: string, end: string) => {
    const startDate = parse(start, 'HH:mm:ss', new Date());
    const endDate = parse(end, 'HH:mm:ss', new Date());
    return `${format(startDate, 'h:mm a')} – ${format(endDate, 'h:mm a')}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.permitNumber.trim()) {
      newErrors.permitNumber = 'Permit number is required';
    }

    if (!formData.learnerPermitIssueDate) {
      newErrors.learnerPermitIssueDate = 'Permit issue date is required';
    }

    if (!formData.permitExpirationDate) {
      newErrors.permitExpirationDate = 'Permit expiration date is required';
    }

    if (!formData.drivingExperience.trim()) {
      newErrors.drivingExperience = 'Driving experience is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slot || !validateForm()) return;

    const hoursToConsume = calculateHoursToConsume(slot.startTime, slot.endTime);
    
    const payload: BookDirectAppointmentPayload = {
      availableAppointmentSlotId: slot.id,
      hoursToConsume,
      amountPaid: slot.pricePerSlot || 25,
      note: formData.note || undefined,
      learnerPermitIssueDate: formData.learnerPermitIssueDate 
        ? format(formData.learnerPermitIssueDate, 'yyyy-MM-dd') 
        : undefined,
      permitNumber: formData.permitNumber || undefined,
      permitExpirationDate: formData.permitExpirationDate 
        ? format(formData.permitExpirationDate, 'yyyy-MM-dd') 
        : undefined,
      drivingExperience: formData.drivingExperience || undefined,
      isLicenceFromAnotherCountry: formData.isLicenceFromAnotherCountry
    };

    setFormData(initialFormState);
    setErrors({});
    
    onSubmit(payload);
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setErrors({});
    onClose();
  };

  if (!slot) return null;

  const hoursToConsume = calculateHoursToConsume(slot.startTime, slot.endTime);
  const displayPrice = slot.pricePerSlot || 25;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-background text-foreground border border-border/80 shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-semibold">Book appointment</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Review your slot details and share your permit info to confirm the session.
              </DialogDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {sessionDate}
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {hoursToConsume}h session
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                ${displayPrice}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Time slot</p>
                </div>
                <Badge variant="secondary">{formatTimeRange(slot.startTime, slot.endTime)}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                  <p className="font-semibold leading-tight">{slot.instructorName || `Instructor ${slot.instructorId}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-muted text-foreground/80">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-semibold leading-tight">{slot.location || 'Location TBD'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-semibold leading-tight">${displayPrice}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-sm">
              <p className="text-sm font-semibold text-primary mb-1">Quick tips</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Ensure your permit dates are accurate.</li>
                <li>Add notes for accessibility or learning goals.</li>
                <li>You can update details before confirming.</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Permit & experience</p>
                <span className="text-xs text-muted-foreground">All fields are required</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="permitNumber" className="text-sm font-medium">Permit Number *</Label>
                  <Input
                    id="permitNumber"
                    placeholder="Enter your permit number"
                    value={formData.permitNumber}
                    onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                    className={`${errors.permitNumber ? 'border-destructive text-destructive' : ''}`}
                  />
                  {errors.permitNumber && (
                    <p className="text-destructive text-sm mt-1">{errors.permitNumber}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drivingExperience" className="text-sm font-medium">Driving Experience *</Label>
                  <Textarea
                    id="drivingExperience"
                    placeholder="Describe your driving experience..."
                    value={formData.drivingExperience}
                    onChange={(e) => setFormData({ ...formData, drivingExperience: e.target.value })}
                    rows={3}
                    className={`${errors.drivingExperience ? 'border-destructive text-destructive' : ''} bg-background`}
                  />
                  {errors.drivingExperience && (
                    <p className="text-destructive text-sm mt-1">{errors.drivingExperience}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Learner Permit Issue Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal bg-background ${
                          !formData.learnerPermitIssueDate && 'text-muted-foreground'
                        } ${errors.learnerPermitIssueDate ? 'border-destructive text-destructive' : ''}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.learnerPermitIssueDate ? (
                          format(formData.learnerPermitIssueDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border border-border/70" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.learnerPermitIssueDate}
                        onSelect={(date) => setFormData({ ...formData, learnerPermitIssueDate: date })}
                        initialFocus
                        className="rounded-md"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.learnerPermitIssueDate && (
                    <p className="text-destructive text-sm mt-1">{errors.learnerPermitIssueDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Permit Expiration Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal bg-background ${
                          !formData.permitExpirationDate && 'text-muted-foreground'
                        } ${errors.permitExpirationDate ? 'border-destructive text-destructive' : ''}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.permitExpirationDate ? (
                          format(formData.permitExpirationDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border border-border/70" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.permitExpirationDate}
                        onSelect={(date) => setFormData({ ...formData, permitExpirationDate: date })}
                        initialFocus
                        className="rounded-md"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.permitExpirationDate && (
                    <p className="text-destructive text-sm mt-1">{errors.permitExpirationDate}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-border/60 px-4 py-3 bg-muted/30">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="isLicenceFromAnotherCountry"
                    checked={formData.isLicenceFromAnotherCountry}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isLicenceFromAnotherCountry: !!checked })
                    }
                  />
                  <Label htmlFor="isLicenceFromAnotherCountry" className="text-sm">
                    I have a license from another country
                  </Label>
                </div>
                <Badge variant="outline" className="text-xs">
                  Verification may be required
                </Badge>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm space-y-3">
              <Label htmlFor="note" className="text-sm font-medium">Notes for your instructor (optional)</Label>
              <Textarea
                id="note"
                placeholder="Share accessibility needs, learning goals, or other notes."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
                className="bg-background"
              />
            </div>

            <DialogFooter className="gap-3 pt-2 flex-col sm:flex-row">
              <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? 'Booking...' : `Book Appointment - ${displayPrice}`}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
