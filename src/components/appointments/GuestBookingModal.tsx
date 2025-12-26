import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock, User, MapPin, DollarSign, UserPlus, Mail, Phone, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { AppointmentSlot } from '@/redux/reducers/appointmentReducer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface GuestBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  slot: AppointmentSlot | null;
  loading: boolean;
}

interface GuestBookingPayload {
  appointment_info: {
    availableAppointmentSlotId: number;
    hoursToConsume: number;
    amountPaid: number;
    note?: string;
    learnerPermitIssueDate?: string;
    permitNumber?: string;
    permitExpirationDate?: string;
    drivingExperience?: string;
    isLicenceFromAnotherCountry: boolean;
  };
  user_info?: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
  };
}

const GuestBookingModal: React.FC<GuestBookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  slot,
  loading
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!auth.userInfo;
  const user = auth.userInfo;
  const userDetails = user?.user_detail;
  
  // Initial empty form state
  const initialFormState = {
    // Appointment info
    note: '',
    learnerPermitIssueDate: undefined as Date | undefined,
    permitNumber: '',
    permitExpirationDate: undefined as Date | undefined,
    drivingExperience: '',
    isLicenceFromAnotherCountry: false,
    // User registration info
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>(isAuthenticated ? 'appointment' : 'register');

  const parseDate = useMemo(() => (value?: string | null) => {
    if (!value) return undefined;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, []);
  
  // Reset form when the modal opens or closes
  React.useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData(initialFormState);
      setErrors({});
    }
    
    // Pre-fill user data if authenticated
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email || '',
        phone: user.phone || '',
        learnerPermitIssueDate:
          prev.learnerPermitIssueDate || parseDate(userDetails?.learners_permit_issue_date),
        drivingExperience: prev.drivingExperience || userDetails?.driving_experience || '',
        isLicenceFromAnotherCountry:
          userDetails?.has_foreign_driving_license ?? prev.isLicenceFromAnotherCountry
      }));
      setActiveTab('appointment');
    } else {
      setActiveTab('register');
    }
  }, [isOpen, isAuthenticated, user, userDetails, parseDate]);

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

    // Validate appointment info
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

    // Validate registration info if user is not authenticated
    if (!isAuthenticated) {
      if (!formData.full_name.trim()) {
        newErrors.full_name = 'Full name is required';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }

      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slot || !validateForm()) return;

    const hoursToConsume = calculateHoursToConsume(slot.startTime, slot.endTime);
    
    const payload: GuestBookingPayload = {
      appointment_info: {
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
      }
    };

    // Add user_info if not authenticated
    if (!isAuthenticated) {
      payload.user_info = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      };
    }

    // Reset form data after submission
    setFormData(initialFormState);
    setErrors({});
    
    onSubmit(payload);
  };

  const handleClose = () => {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl border-t-4 border-blue-500">
        <DialogHeader className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Book Your Driving Lesson
          </DialogTitle>
          <DialogDescription className="text-base opacity-90">
            Complete the form below to secure your appointment with our professional instructor.
          </DialogDescription>
        </DialogHeader>

        {/* Slot Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl mb-6 shadow-sm border border-blue-100 dark:border-gray-600">
          <h3 className="font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 mb-4">Appointment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 rounded-full">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Time Slot</p>
                <p className="font-semibold">{slot.startTime} - {slot.endTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2.5 rounded-full">
                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Instructor</p>
                <p className="font-semibold">{slot.instructorName || `Instructor ${slot.instructorId}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 rounded-full">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Location</p>
                <p className="font-semibold">{slot.location || 'Location TBD'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2.5 rounded-full">
                <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Price ({hoursToConsume}h)</p>
                <p className="font-semibold">${displayPrice}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className={isAuthenticated ? 'hidden' : ''}
          >
            <TabsList className="grid w-full grid-cols-2 bg-blue-50 dark:bg-gray-700 p-1 rounded-xl">
              <TabsTrigger 
                value="register" 
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appointment" 
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                <span>Appointment Details</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Registration Tab */}
            <TabsContent value="register" className="pt-6 space-y-5">
              <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 mb-6">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Create an account to book appointments and access your lessons</span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium flex items-center gap-1">
                    <User className="h-3.5 w-3.5 opacity-70" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className={`h-11 ${errors.full_name ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 opacity-70" />
                    <span>Email Address *</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`h-11 ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 opacity-70" />
                  <span>Phone Number *</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`h-11 ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 opacity-70" />
                    <span>Password *</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`h-11 ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 opacity-70" />
                    <span>Confirm Password *</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`h-11 ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
              
              <Button 
                type="button" 
                onClick={() => setActiveTab('appointment')} 
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11 text-white font-medium"
              >
                Continue to Appointment Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>
            
            {/* Appointment Details Tab */}
            <TabsContent value="appointment" className="pt-6 space-y-5">
              {/* Permit Information Section */}
              <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/30 mb-6">
                <p className="text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Please provide your learner's permit information to book your driving lesson</span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Permit Number */}
                <div className="space-y-2">
                  <Label htmlFor="permitNumber" className="text-sm font-medium">Permit Number *</Label>
                  <Input
                    id="permitNumber"
                    placeholder="Enter your permit number"
                    value={formData.permitNumber}
                    onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                    className={`h-11 ${errors.permitNumber ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.permitNumber && (
                    <p className="text-red-500 text-sm">{errors.permitNumber}</p>
                  )}
                </div>

                {/* License from another country */}
                <div className="space-y-2 flex items-start pt-8">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="isLicenceFromAnotherCountry"
                      checked={formData.isLicenceFromAnotherCountry}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, isLicenceFromAnotherCountry: !!checked })
                      }
                      className="h-5 w-5 rounded"
                    />
                    <Label htmlFor="isLicenceFromAnotherCountry" className="text-sm">
                      I have a license from another country
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Permit Issue Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Learner Permit Issue Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full h-11 justify-start text-left font-normal ${
                          !formData.learnerPermitIssueDate && "text-muted-foreground"
                        } ${errors.learnerPermitIssueDate ? 'border-red-500 ring-1 ring-red-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.learnerPermitIssueDate ? (
                          format(formData.learnerPermitIssueDate, "PPP")
                        ) : (
                          <span>Pick issue date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.learnerPermitIssueDate}
                        onSelect={(date) => setFormData({ ...formData, learnerPermitIssueDate: date })}
                        initialFocus
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.learnerPermitIssueDate && (
                    <p className="text-red-500 text-sm">{errors.learnerPermitIssueDate}</p>
                  )}
                </div>

                {/* Permit Expiration Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Permit Expiration Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full h-11 justify-start text-left font-normal ${
                          !formData.permitExpirationDate && "text-muted-foreground"
                        } ${errors.permitExpirationDate ? 'border-red-500 ring-1 ring-red-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.permitExpirationDate ? (
                          format(formData.permitExpirationDate, "PPP")
                        ) : (
                          <span>Pick expiration date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.permitExpirationDate}
                        onSelect={(date) => setFormData({ ...formData, permitExpirationDate: date })}
                        initialFocus
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.permitExpirationDate && (
                    <p className="text-red-500 text-sm">{errors.permitExpirationDate}</p>
                  )}
                </div>
              </div>

              {/* Driving Experience */}
              <div className="space-y-2">
                <Label htmlFor="drivingExperience" className="text-sm font-medium">Driving Experience *</Label>
                <Textarea
                  id="drivingExperience"
                  placeholder="Describe your driving experience level, how long you've been driving, any challenges you face, etc."
                  value={formData.drivingExperience}
                  onChange={(e) => setFormData({ ...formData, drivingExperience: e.target.value })}
                  rows={3}
                  className={`resize-none ${errors.drivingExperience ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.drivingExperience && (
                  <p className="text-red-500 text-sm">{errors.drivingExperience}</p>
                )}
              </div>

              {/* Note - Optional */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium flex items-center gap-1">
                  <span>Additional Notes</span>
                  <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Textarea
                  id="note"
                  placeholder="Any specific requirements, questions, or information you'd like to share with the instructor..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={2}
                  className="resize-none focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('register')} 
                    variant="outline"
                    className="sm:flex-1 h-11"
                  >
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                    Back to Registration
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Booking
                        <DollarSign className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              <DialogFooter className={`${!isAuthenticated ? 'hidden' : 'flex'} gap-2 pt-4`}>
                <Button type="button" variant="outline" onClick={handleClose} className="h-11">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Book Appointment - ${displayPrice}
                      <DollarSign className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
          
          {/* When user is authenticated, show only appointment form */}
          {isAuthenticated && (
            <div className="space-y-5 pt-4">
              {/* Welcome message for authenticated users */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-blue-100 dark:border-indigo-800/30 flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Welcome, {user?.full_name}
                  </p>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                    Please provide your permit information to book your driving lesson
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Permit Number */}
                <div className="space-y-2">
                  <Label htmlFor="permitNumber" className="text-sm font-medium">Permit Number *</Label>
                  <Input
                    id="permitNumber"
                    placeholder="Enter your permit number"
                    value={formData.permitNumber}
                    onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                    className={`h-11 ${errors.permitNumber ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {errors.permitNumber && (
                    <p className="text-red-500 text-sm">{errors.permitNumber}</p>
                  )}
                </div>

                {/* License from another country */}
                <div className="space-y-2 flex items-start pt-8">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="isLicenceFromAnotherCountry"
                      checked={formData.isLicenceFromAnotherCountry}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, isLicenceFromAnotherCountry: !!checked })
                      }
                      className="h-5 w-5 rounded"
                    />
                    <Label htmlFor="isLicenceFromAnotherCountry" className="text-sm">
                      I have a license from another country
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Permit Issue Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Learner Permit Issue Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full h-11 justify-start text-left font-normal ${
                          !formData.learnerPermitIssueDate && "text-muted-foreground"
                        } ${errors.learnerPermitIssueDate ? 'border-red-500 ring-1 ring-red-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.learnerPermitIssueDate ? (
                          format(formData.learnerPermitIssueDate, "PPP")
                        ) : (
                          <span>Pick issue date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.learnerPermitIssueDate}
                        onSelect={(date) => setFormData({ ...formData, learnerPermitIssueDate: date })}
                        initialFocus
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.learnerPermitIssueDate && (
                    <p className="text-red-500 text-sm">{errors.learnerPermitIssueDate}</p>
                  )}
                </div>

                {/* Permit Expiration Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Permit Expiration Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full h-11 justify-start text-left font-normal ${
                          !formData.permitExpirationDate && "text-muted-foreground"
                        } ${errors.permitExpirationDate ? 'border-red-500 ring-1 ring-red-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.permitExpirationDate ? (
                          format(formData.permitExpirationDate, "PPP")
                        ) : (
                          <span>Pick expiration date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.permitExpirationDate}
                        onSelect={(date) => setFormData({ ...formData, permitExpirationDate: date })}
                        initialFocus
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.permitExpirationDate && (
                    <p className="text-red-500 text-sm">{errors.permitExpirationDate}</p>
                  )}
                </div>
              </div>

              {/* Driving Experience */}
              <div className="space-y-2">
                <Label htmlFor="drivingExperience" className="text-sm font-medium">Driving Experience *</Label>
                <Textarea
                  id="drivingExperience"
                  placeholder="Describe your driving experience level, how long you've been driving, any challenges you face, etc."
                  value={formData.drivingExperience}
                  onChange={(e) => setFormData({ ...formData, drivingExperience: e.target.value })}
                  rows={3}
                  className={`resize-none ${errors.drivingExperience ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.drivingExperience && (
                  <p className="text-red-500 text-sm">{errors.drivingExperience}</p>
                )}
              </div>

              {/* Note - Optional */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium flex items-center gap-1">
                  <span>Additional Notes</span>
                  <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Textarea
                  id="note"
                  placeholder="Any specific requirements, questions, or information you'd like to share with the instructor..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={2}
                  className="resize-none focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <DialogFooter className="gap-3 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  className="h-11"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Book Appointment - ${displayPrice}
                      <DollarSign className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestBookingModal;
