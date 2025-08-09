import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock, User, MapPin, DollarSign } from 'lucide-react';
import { AppointmentSlot } from '@/redux/reducers/appointmentReducer';
import { BookDirectAppointmentPayload } from '@/redux/actions/appointmentAction';

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
  
  // Reset form when the modal opens or closes
  React.useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData(initialFormState);
      setErrors({});
    }
  }, [isOpen]);

  // Calculate hours to consume based on start and end time
  const calculateHoursToConsume = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.round(diffInHours * 100) / 100; // Round to 2 decimal places
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

    // Reset form data after submission
    console.log("Form submitted, resetting form data");
    setFormData(initialFormState);
    setErrors({});
    
    onSubmit(payload);
  };

  const handleClose = () => {
    console.log("Closing booking modal and resetting form");
    // Reset to initial state
    setFormData(initialFormState);
    setErrors({});
    onClose();
  };

  if (!slot) return null;

  const hoursToConsume = calculateHoursToConsume(slot.startTime, slot.endTime);
  const displayPrice = slot.pricePerSlot || 25;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-700">
            Book Appointment
          </DialogTitle>
          <DialogDescription>
            Please fill in the required information to book your appointment.
          </DialogDescription>
        </DialogHeader>

        {/* Slot Summary */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-blue-800 mb-2">Appointment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>{slot.startTime} - {slot.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span>{slot.instructorName || `Instructor ${slot.instructorId}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>{slot.location || 'Location TBD'}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span>${displayPrice} ({hoursToConsume}h)</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Note */}
          <div>
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Any additional notes..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
            />
          </div>

          {/* Permit Number */}
          <div>
            <Label htmlFor="permitNumber">Permit Number *</Label>
            <Input
              id="permitNumber"
              placeholder="Enter your permit number"
              value={formData.permitNumber}
              onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
              className={errors.permitNumber ? 'border-red-500' : ''}
            />
            {errors.permitNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.permitNumber}</p>
            )}
          </div>

          {/* Permit Issue Date */}
          <div>
            <Label>Learner Permit Issue Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !formData.learnerPermitIssueDate && "text-muted-foreground"
                  } ${errors.learnerPermitIssueDate ? 'border-red-500' : ''}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.learnerPermitIssueDate ? (
                    format(formData.learnerPermitIssueDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.learnerPermitIssueDate}
                  onSelect={(date) => setFormData({ ...formData, learnerPermitIssueDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.learnerPermitIssueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.learnerPermitIssueDate}</p>
            )}
          </div>

          {/* Permit Expiration Date */}
          <div>
            <Label>Permit Expiration Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !formData.permitExpirationDate && "text-muted-foreground"
                  } ${errors.permitExpirationDate ? 'border-red-500' : ''}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.permitExpirationDate ? (
                    format(formData.permitExpirationDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.permitExpirationDate}
                  onSelect={(date) => setFormData({ ...formData, permitExpirationDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.permitExpirationDate && (
              <p className="text-red-500 text-sm mt-1">{errors.permitExpirationDate}</p>
            )}
          </div>

          {/* Driving Experience */}
          <div>
            <Label htmlFor="drivingExperience">Driving Experience *</Label>
            <Textarea
              id="drivingExperience"
              placeholder="Describe your driving experience..."
              value={formData.drivingExperience}
              onChange={(e) => setFormData({ ...formData, drivingExperience: e.target.value })}
              rows={3}
              className={errors.drivingExperience ? 'border-red-500' : ''}
            />
            {errors.drivingExperience && (
              <p className="text-red-500 text-sm mt-1">{errors.drivingExperience}</p>
            )}
          </div>

          {/* License from another country */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isLicenceFromAnotherCountry"
              checked={formData.isLicenceFromAnotherCountry}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isLicenceFromAnotherCountry: !!checked })
              }
            />
            <Label htmlFor="isLicenceFromAnotherCountry">
              I have a license from another country
            </Label>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Booking...' : `Book Appointment - ${displayPrice}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};



export default BookingModal;