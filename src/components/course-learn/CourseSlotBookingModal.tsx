import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, User, MapPin } from "lucide-react";
import { AppointmentSlot } from "@/redux/reducers/appointmentReducer";
import { BookCourseAppointmentPayload } from "@/redux/actions/appointmentAction";
import { format, parse } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CourseSlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: BookCourseAppointmentPayload) => void;
  slot: AppointmentSlot | null;
  userCourseId?: number;
  loading: boolean;
}

const CourseSlotBookingModal: React.FC<CourseSlotBookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  slot,
  userCourseId,
  loading,
}) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userDetails = userInfo?.user_detail;

  const initialFormState = {
    note: "",
    learnerPermitIssueDate: undefined as Date | undefined,
    permitNumber: "",
    permitExpirationDate: undefined as Date | undefined,
    drivingExperience: "",
    isLicenceFromAnotherCountry: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parseDate = useMemo(() => (value?: string | null) => {
    if (!value) return undefined;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, []);

  useEffect(() => {
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
        drivingExperience: prev.drivingExperience || userDetails.driving_experience || "",
        isLicenceFromAnotherCountry:
          userDetails.has_foreign_driving_license ?? prev.isLicenceFromAnotherCountry,
      }));
    }
  }, [isOpen, userDetails, parseDate]);

  if (!slot || !userCourseId) return null;

  const calculateHoursToConsume = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.round(diffInHours * 100) / 100;
  };

  const formatTimeRange = (start: string, end: string) => {
    const startDate = parse(start, "HH:mm:ss", new Date());
    const endDate = parse(end, "HH:mm:ss", new Date());
    return `${format(startDate, "h:mm a")} – ${format(endDate, "h:mm a")}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.permitNumber.trim()) {
      newErrors.permitNumber = "Permit number is required";
    }

    if (!formData.learnerPermitIssueDate) {
      newErrors.learnerPermitIssueDate = "Permit issue date is required";
    }

    if (!formData.permitExpirationDate) {
      newErrors.permitExpirationDate = "Permit expiration date is required";
    }

    if (!formData.drivingExperience.trim()) {
      newErrors.drivingExperience = "Driving experience is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!slot || !validateForm()) return;

    const hoursToConsume = calculateHoursToConsume(slot.startTime, slot.endTime);

    const payload: BookCourseAppointmentPayload = {
      availableAppointmentSlotId: slot.id,
      userCourseId,
      hoursToConsume,
      note: formData.note || undefined,
      learnerPermitIssueDate: formData.learnerPermitIssueDate
        ? format(formData.learnerPermitIssueDate, "yyyy-MM-dd")
        : undefined,
      permitNumber: formData.permitNumber || undefined,
      permitExpirationDate: formData.permitExpirationDate
        ? format(formData.permitExpirationDate, "yyyy-MM-dd")
        : undefined,
      drivingExperience: formData.drivingExperience || undefined,
      isLicenceFromAnotherCountry: formData.isLicenceFromAnotherCountry,
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

  const hoursToConsume = calculateHoursToConsume(slot.startTime, slot.endTime);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-foreground border border-border/70">
        <DialogHeader className="space-y-2 pb-2 border-b border-border/70">
          <DialogTitle className="text-xl font-semibold">Confirm offline booking</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Review your session details and share the required permit information to finalize the booking.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-lg mb-5 border border-border/60">
          <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Appointment summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time slot</p>
                <p className="font-semibold leading-tight">{formatTimeRange(slot.startTime, slot.endTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted text-foreground/80">
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
                <p className="font-semibold leading-tight">{slot.location || "Location TBD"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Session duration</p>
                <p className="font-semibold leading-tight">{hoursToConsume} hours</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium">Notes for instructor (optional)</Label>
            <Textarea
              id="note"
              placeholder="Share any guidance for your instructor or accessibility needs."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              className="bg-background"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="permitNumber" className="text-sm font-medium">Permit Number</Label>
              <Input
                id="permitNumber"
                placeholder="Enter your permit number"
                value={formData.permitNumber}
                onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                className={errors.permitNumber ? "border-destructive" : ""}
              />
              {errors.permitNumber && (
                <p className="text-xs text-destructive">{errors.permitNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="drivingExperience" className="text-sm font-medium">Driving Experience</Label>
              <Input
                id="drivingExperience"
                placeholder="e.g., 6 months behind the wheel"
                value={formData.drivingExperience}
                onChange={(e) => setFormData({ ...formData, drivingExperience: e.target.value })}
                className={errors.drivingExperience ? "border-destructive" : ""}
              />
              {errors.drivingExperience && (
                <p className="text-xs text-destructive">{errors.drivingExperience}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Permit Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${errors.learnerPermitIssueDate ? "border-destructive" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.learnerPermitIssueDate
                      ? format(formData.learnerPermitIssueDate, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.learnerPermitIssueDate}
                    onSelect={(date) => setFormData({ ...formData, learnerPermitIssueDate: date })}
                  />
                </PopoverContent>
              </Popover>
              {errors.learnerPermitIssueDate && (
                <p className="text-xs text-destructive">{errors.learnerPermitIssueDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Permit Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${errors.permitExpirationDate ? "border-destructive" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.permitExpirationDate
                      ? format(formData.permitExpirationDate, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.permitExpirationDate}
                    onSelect={(date) => setFormData({ ...formData, permitExpirationDate: date })}
                  />
                </PopoverContent>
              </Popover>
              {errors.permitExpirationDate && (
                <p className="text-xs text-destructive">{errors.permitExpirationDate}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isLicenceFromAnotherCountry"
              checked={formData.isLicenceFromAnotherCountry}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isLicenceFromAnotherCountry: Boolean(checked) })
              }
            />
            <Label htmlFor="isLicenceFromAnotherCountry" className="text-sm">
              I have a licence from another country
            </Label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseSlotBookingModal;
