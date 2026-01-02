
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '@/redux/actions/authAction';
import { getAdminRegionList } from '@/redux/actions/adminAction';
import { useToast } from '@/hooks/use-toast';

import { RootState } from '@/redux/store';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const BIRTH_YEAR_FROM = 1920;
const BIRTH_YEAR_TO = new Date().getFullYear() - 12;
const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 11;
const MIN_AGE = 18;

const steps = [
  { label: 'Location & Personal', fields: [ 'regionId', 'firstName', 'lastName', 'birthYear', 'birthMonth', 'birthDay' ] },
  { label: 'Address', fields: [ 'address1', 'city', 'state', 'postal' ] },
  { label: 'Contact', fields: [ 'studentEmail', 'studentPhone', ] },
  { label: 'Permit & Experience', fields: [ 'permitYear', 'permitMonth', 'permitDay', 'hasLicenseAnotherCountry', 'drivingExperience' ] },
  { label: 'Security & Agreements', fields: [ 'password', 'confirmPassword', 'agreements' ] }
];

const Register = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    regionId: '', firstName: '', lastName: '', birthYear: '', birthMonth: '', birthDay: '',
    address1: '', address2: '', city: '', state: '', postal: '',
    studentEmail: '', parentEmail: '', studentPhone: '', parentPhone: '',
    permitYear: '', permitMonth: '', permitDay: '',
    hasLicenseAnotherCountry: '', drivingExperience: '',
    password: '', confirmPassword: '', agreements: [null, null, null, null] as (boolean | null)[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redux selectors
  const { regions } = useSelector((state: RootState) => state.regionList);
  const { loading, error } = useAuth();

  // Show toasts based on Redux state changes

  useEffect(() => {
    if (!loading && error && submitted) {
      toast({ title: 'Registration Failed', description: error, variant: 'destructive' });
      setSubmitted(false);
    }
    if (!loading && submitted && !error) {
      toast({
        title: 'Registration Initiated',
        description: 'Please check your email for verification code.'
      });
      // Store email for OTP verification
      sessionStorage.setItem('registrationEmail', form.studentEmail);
      navigate('/register/verify');  // Navigate to OTP page instead of login
    }
  }, [loading, error, toast, submitted, navigate, form.studentEmail]);

  // useEffect(() => {
  //   if (!loading && error) {
  //     toast({ title: 'Registration Failed', description: error, variant: 'destructive' });
  //     setSubmitted(false);
  //   }
  //   if (!loading && submitted && !error) {
  //     toast({ title: 'Registration Successful', description: 'You can now sign in with your credentials.' });
  //     navigate('/login');
  //   }
  // }, [loading, error, toast, submitted, navigate]);

  // Optional: handle success message if you store it in Redux; otherwise, you can rely on the action to dispatch a success message
  // For now, we assume success is handled by redirecting or by a global listener

  useEffect(() => {
    if (!regions || regions.length === 0) { dispatch(getAdminRegionList() as any); }
  }, [dispatch, regions]);

  const AGREE_TEXTS = [
    'I agree that 50% of the Certificate Programs needs to be paid before Online portion begins and the remaining 50% before 1st IN CAR lesson.',
    'Online learning is to be completed within 90 days from payment. If an extension is needed, student is required to let instructor know.',
    'Student must be ready to the satisfaction of the Instructor before road test is booked.',
    'Refund Policy - If Online training has started but not completed, no refund will be given. Once IN-CAR Training has begun the refund will be based on number of sessions completed, for that portion of payment.',
  ];
  const handleFieldChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
  const handleAgreement = (idx: number, value: string) => {
    setForm((prev) => ({ ...prev, agreements: prev.agreements.map((a, i) => i === idx ? value === 'agree' : a) }));
    setTouched((prev) => ({ ...prev, [`agreements${idx}`]: true }));
  };

  // Step validation helpers
  function fieldsValidFor(stepIdx: number) {
    const s = steps[stepIdx].fields;
    if (s.includes('agreements')) {
      return (
        !!form.password &&
        !!form.confirmPassword &&
        form.password === form.confirmPassword &&
        form.agreements.every((a) => a !== null)
      );
    } else if (s.includes('studentEmail')) {
      const phoneDigits = (form.studentPhone || '').replace(/\D/g, '');
      return !!form.studentEmail && (phoneDigits.length >= MIN_PHONE_DIGITS && phoneDigits.length <= MAX_PHONE_DIGITS);
    } else if (s.includes('studentPhone')) {
      const phoneDigits = (form.studentPhone || '').replace(/\D/g, '');
      return !!form.studentPhone && (phoneDigits.length >= MIN_PHONE_DIGITS && phoneDigits.length <= MAX_PHONE_DIGITS);
    } else if (s.includes('address1')) {
      return !!form.address1 && !!form.city && !!form.state && !!form.postal;
    } else if (s.includes('regionId')) {
      // Check age for birth date fields
      if (form.birthYear && form.birthMonth && form.birthDay) {
        const dob = new Date(
          `${form.birthYear}-${form.birthMonth.toString().padStart(2, '0')}-${form.birthDay.toString().padStart(2, '0')}`
        );
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        
        if (age < MIN_AGE) {
          return false; // Under 18, invalid
        }
      }
      
      return (
        !!form.regionId &&
        !!form.firstName &&
        !!form.lastName &&
        !!form.birthYear &&
        !!form.birthMonth &&
        !!form.birthDay
      );
    } else if (s.includes('permitYear')) {
      return (
        !!form.permitYear &&
        !!form.permitMonth &&
        !!form.permitDay &&
        !!form.hasLicenseAnotherCountry &&
        !!form.drivingExperience
      );
    }
    return true;
  }

  // Final validation: all steps must be valid
  const canSubmit = steps.every((_, i) => fieldsValidFor(i));

  // Animate step transitions (simple fade)
  const stepFadeStyle = {
    transition: 'opacity .25s',
    opacity: 1,
    animation: 'fadeIn .7s'
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const today = new Date();

    if (form.birthYear && form.birthMonth && form.birthDay) {
      const dob = new Date(
        `${form.birthYear}-${form.birthMonth.toString().padStart(2, '0')}-${form.birthDay.toString().padStart(2, '0')}`
      );
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < MIN_AGE) {
        toast({
          title: 'Invalid Date of Birth',
          description: 'You must be at least 18 years old to register.',
          variant: 'destructive',
        } as any);
        return;
      }
    }

    if (form.permitYear && form.permitMonth && form.permitDay) {
      const permitDate = new Date(
        `${form.permitYear}-${form.permitMonth.toString().padStart(2, '0')}-${form.permitDay.toString().padStart(2, '0')}`
      );
      if (permitDate > today) {
        toast({
          title: "Invalid Learner's Permit Date",
          description: 'Learner\'s permit issue date cannot be in the future.',
          variant: 'destructive',
        } as any);
        return;
      }
    }
    const payload = {
      region_id: form.regionId,
      first_name: form.firstName,
      last_name: form.lastName,
      birth_date: {
        year: Number(form.birthYear),
        month: Number(form.birthMonth),
        day: Number(form.birthDay),
      },
      address: {
        street_address: form.address1,
        street_address2: form.address2,
        city: form.city,
        state: form.state,
        postal: form.postal,
      },
      student_email: form.studentEmail,
      parent_email: form.parentEmail,
      student_phone: form.studentPhone,
      parent_phone: form.parentPhone,
      learners_permit_issue_date: {
        year: Number(form.permitYear),
        month: Number(form.permitMonth),
        day: Number(form.permitDay),
      },
      has_license_from_another_country: form.hasLicenseAnotherCountry,
      driving_experience: form.drivingExperience,
      password: form.password,
      agreements: {
        paid_policy: form.agreements[0] === true,
        completion_policy: form.agreements[1] === true,
        instructor_ready_policy: form.agreements[2] === true,
        refund_policy: form.agreements[3] === true,
      }
    };
    dispatch(register(payload) as any);
    setSubmitted(true);
  }

  // --- Step Contents Rendered ---
  function renderStepContent(idx: number) {
    const birthDateISO =
      form.birthYear && form.birthMonth && form.birthDay
        ? `${form.birthYear}-${form.birthMonth.toString().padStart(2, '0')}-${form.birthDay.toString().padStart(2, '0')}`
        : '';
    const permitDateISO =
      form.permitYear && form.permitMonth && form.permitDay
        ? `${form.permitYear}-${form.permitMonth.toString().padStart(2, '0')}-${form.permitDay.toString().padStart(2, '0')}`
        : '';

    const birthDate = birthDateISO ? new Date(birthDateISO) : undefined;
    const permitDate = permitDateISO ? new Date(permitDateISO) : undefined;
    const todayISO = new Date().toISOString().split('T')[0];

    const handleBirthDateChange = (val: string) => {
      const [y, m, d] = val.split('-');
      handleFieldChange('birthYear', y || '');
      handleFieldChange('birthMonth', m || '');
      handleFieldChange('birthDay', d || '');
    };

    const handlePermitDateChange = (val: string) => {
      const [y, m, d] = val.split('-');
      handleFieldChange('permitYear', y || '');
      handleFieldChange('permitMonth', m || '');
      handleFieldChange('permitDay', d || '');
    };
    switch(idx) {
      case 0:
        return (
          <div style={stepFadeStyle}>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
              Please choose a location <span className="text-red-500">*</span>
            </Label>
            <Select value={form.regionId} onValueChange={val => handleFieldChange('regionId', val)}>
              <SelectTrigger className="mt-2 bg-white dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-900 dark:text-gray-100">{regions?.map(r => <SelectItem key={r.id} value={r.id?.toString() || ''}>{r.region_name || `Region ${r.id}`}</SelectItem>)}</SelectContent>
            </Select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">First Name <span className="text-red-500">*</span></Label>
                <Input placeholder="First Name" value={form.firstName} onChange={e => handleFieldChange('firstName', e.target.value)} className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
              </div>
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Last Name <span className="text-red-500">*</span></Label>
                <Input placeholder="Last Name" value={form.lastName} onChange={e => handleFieldChange('lastName', e.target.value)} className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
              </div>
            </div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mt-4 mb-1">Date of Birth <span className="text-red-500">*</span></Label>
            <div className="mt-1 border rounded-md p-2 bg-white dark:bg-gray-800 dark:border-gray-600">
              <Calendar
                selected={birthDate}
                onSelect={(date) => {
                  if (!date) {
                    handleBirthDateChange('');
                    return;
                  }
                  const y = date.getFullYear().toString();
                  const m = (date.getMonth() + 1).toString().padStart(2, '0');
                  const d = date.getDate().toString().padStart(2, '0');
                  handleBirthDateChange(`${y}-${m}-${d}`);
                }}
                fromYear={BIRTH_YEAR_FROM}
                toYear={BIRTH_YEAR_TO}
                disabled={(date) => date.getFullYear() < BIRTH_YEAR_FROM || date.getFullYear() > BIRTH_YEAR_TO}
                className="dark:text-gray-100"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div style={stepFadeStyle}>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Address <span className="text-red-500">*</span></Label>
            <div className="flex flex-col mt-2">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Street Address <span className="text-red-500">*</span></Label>
              <Input placeholder="Street Address" value={form.address1} onChange={e => handleFieldChange('address1', e.target.value)} className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
            </div>
            <div className="flex flex-col mt-2">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Street Address Line 2 (optional)</Label>
              <Input placeholder="Street Address Line 2 (optional)" value={form.address2} onChange={e => handleFieldChange('address2', e.target.value)} className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">City <span className="text-red-500">*</span></Label>
                <Input placeholder="City" value={form.city} onChange={e => handleFieldChange('city', e.target.value)} className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
              </div>
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">State / Province <span className="text-red-500">*</span></Label>
                <Input placeholder="State / Province" value={form.state} onChange={e => handleFieldChange('state', e.target.value)} className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Postal / Zip Code <span className="text-red-500">*</span></Label>
              <Input placeholder="Postal / Zip Code" value={form.postal} onChange={e => handleFieldChange('postal', e.target.value)} className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={stepFadeStyle}>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Contact Information <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                  Student's E-mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Student's E-mail"
                  value={form.studentEmail}
                  onChange={e => handleFieldChange('studentEmail', e.target.value)}
                  className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  📧 A verification code will be sent to this email address
                </p>
              </div>
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Parent's E-mail (optional)</Label>
                <Input type="email" placeholder="Parent's E-mail (optional)" value={form.parentEmail} onChange={e => handleFieldChange('parentEmail', e.target.value)} className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Student Phone <span className="text-red-500">*</span></Label>
                <PhoneInput
                  international
                  defaultCountry="CA"
                  value={form.studentPhone}
                  onChange={val => handleFieldChange('studentPhone', val || '')}
                  className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Parent/Guardian Phone (optional)</Label>
                <PhoneInput
                  international
                  defaultCountry="CA"
                  value={form.parentPhone}
                  onChange={val => handleFieldChange('parentPhone', val || '')}
                  className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={stepFadeStyle}>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Learner's Permit Issue Date <span className="text-red-500">*</span></Label>
            <div className="mt-2 border rounded-md p-2 bg-white dark:bg-gray-800 dark:border-gray-600">
              <Calendar
                selected={permitDate}
                onSelect={(date) => {
                  if (!date) {
                    handlePermitDateChange('');
                    return;
                  }
                  const y = date.getFullYear().toString();
                  const m = (date.getMonth() + 1).toString().padStart(2, '0');
                  const d = date.getDate().toString().padStart(2, '0');
                  handlePermitDateChange(`${y}-${m}-${d}`);
                }}
                disabled={(date) => date > new Date()}
                className="dark:text-gray-100"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Date cannot be in the future.</p>
            <div className="mt-5">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Do you have a driver licence from another country? <span className="text-red-500">*</span></Label>
              <Select value={form.hasLicenseAnotherCountry} onValueChange={val => handleFieldChange('hasLicenseAnotherCountry', val)}>
                <SelectTrigger className="bg-white dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">How much driving experience do you have? <span className="text-red-500">*</span></Label>
              <Select value={form.drivingExperience} onValueChange={val => handleFieldChange('drivingExperience', val)}>
                <SelectTrigger className="bg-white dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="some-less-1yr">Some (less than 1 year)</SelectItem>
                  <SelectItem value="1-3yr">1-3 Years</SelectItem>
                  <SelectItem value="3-5yr">3-5 Years</SelectItem>
                  <SelectItem value="5plus">5+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={stepFadeStyle}>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">Account Security & Agreements <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1" htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input
                  id="password" name="password" type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password} onChange={e => handleFieldChange('password', e.target.value)}
                  className="pl-10 pr-10 mt-1 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  style={{right: 16, top: 38}}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1" htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                <Input
                  id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={form.confirmPassword} onChange={e => handleFieldChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 mt-1 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  style={{right: 16, top: 38}}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
                )}
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-100">Agreements <span className="text-red-500">*</span></div>
              {AGREE_TEXTS.map((text, i) => (
                <div key={i} className="mb-2">
                  <span className="text-xs text-gray-800 dark:text-gray-200">{i + 1}. {text}</span>
                  <RadioGroup className="flex space-x-6 mt-1"
                    value={
                      form.agreements[i] === null
                        ? ''
                        : form.agreements[i]
                        ? 'agree'
                        : 'disagree'
                    }
                    onValueChange={val => handleAgreement(i, val)}>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem id={`agree${i}`} value="agree" className="mr-2" />
                      <Label htmlFor={`agree${i}`} className="text-gray-800 dark:text-gray-200">I AGREE</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem id={`disagree${i}`} value="disagree" className="mr-2" />
                      <Label htmlFor={`disagree${i}`} className="text-gray-800 dark:text-gray-200">I DO NOT AGREE</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center py-8 px-3 text-gray-900 dark:text-gray-50">
      <div className="mb-8 text-center space-y-2 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-300 dark:via-indigo-300 dark:to-indigo-100">
          Welcome to Fast Track Drivers Academy Academy
        </h1>
        <div className="text-base md:text-lg text-gray-700 dark:text-gray-200 font-medium">
          Let’s get you started — {steps.length} quick steps!
        </div>
      </div>
      <Card className="w-full max-w-4xl shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur border border-gray-200 dark:border-gray-800">
        <CardHeader className="flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2 text-xs md:text-sm">
            {steps.map((s, idx) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className={`rounded-full w-7 h-7 flex items-center justify-center text-white font-bold text-xs
                  ${idx === step ? 'bg-blue-500' : idx < step ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}
                `}>{idx + 1}</span>{idx < steps.length-1 && <div className="h-1 w-6 bg-gray-300 dark:bg-gray-700 rounded" />}
              </div>
            ))}
          </div>
          <CardTitle className="text-lg md:text-xl text-center text-gray-900 dark:text-white">Step {step + 1}: {steps[step].label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent(step)}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
              <Button type="button" variant="secondary" className="px-8 order-2 sm:order-1" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s-1))}>
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button
                  type="button"
                  className="px-8 order-1 sm:order-2"
                  onClick={() => {
                  // Always allow clicking Next, but validate on click
                  const currentStepFields = steps[step].fields;
                  
                  // Check age validation first
                  if (currentStepFields.includes('birthYear') || currentStepFields.includes('birthMonth') || currentStepFields.includes('birthDay')) {
                    if (form.birthYear && form.birthMonth && form.birthDay) {
                      const dob = new Date(
                        `${form.birthYear}-${form.birthMonth.toString().padStart(2, '0')}-${form.birthDay.toString().padStart(2, '0')}`
                      );
                      const today = new Date();
                      let age = today.getFullYear() - dob.getFullYear();
                      const m = today.getMonth() - dob.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                        age--;
                      }
                      
                      if (age < MIN_AGE) {
                        toast({
                          title: 'Invalid Date of Birth',
                          description: 'Please enter a valid date of birth. You must be at least 18 years old.',
                          variant: 'destructive',
                        });
                        return; // Stop here, don't proceed
                      }
                    } else {
                      toast({
                        title: 'Invalid Date of Birth',
                        description: 'Please enter a valid date of birth. You must be at least 18 years old.',
                        variant: 'destructive',
                      });
                      return;
                    }
                  }
                  
                  // Check other validations
                  if (currentStepFields.includes('regionId') || currentStepFields.includes('firstName') || currentStepFields.includes('lastName')) {
                    if (!form.regionId || !form.firstName || !form.lastName) {
                      toast({
                        title: 'Missing Information',
                        description: 'Please fill in all required personal information fields.',
                        variant: 'destructive',
                      });
                      return;
                    }
                  }
                  
                  if (currentStepFields.includes('address1') || currentStepFields.includes('city') || currentStepFields.includes('state') || currentStepFields.includes('postal')) {
                    if (!form.address1 || !form.city || !form.state || !form.postal) {
                      toast({
                        title: 'Missing Address',
                        description: 'Please fill in all required address fields.',
                        variant: 'destructive',
                      });
                      return;
                    }
                  }
                  
                  if (currentStepFields.includes('studentEmail') || currentStepFields.includes('studentPhone')) {
                    const phoneDigits = (form.studentPhone || '').replace(/\D/g, '');
                    if (!form.studentEmail || phoneDigits.length < MIN_PHONE_DIGITS || phoneDigits.length > MAX_PHONE_DIGITS) {
                      toast({
                        title: 'Invalid Contact',
                        description: 'Please enter a valid email and phone number (10-11 digits).',
                        variant: 'destructive',
                      });
                      return;
                    }
                  }
                  
                  if (currentStepFields.includes('permitYear') || currentStepFields.includes('permitMonth') || currentStepFields.includes('permitDay')) {
                    if (form.permitYear && form.permitMonth && form.permitDay) {
                      const permitDate = new Date(
                        `${form.permitYear}-${form.permitMonth.toString().padStart(2, '0')}-${form.permitDay.toString().padStart(2, '0')}`
                      );
                      const today = new Date();
                      if (permitDate > today) {
                        toast({
                          title: 'Invalid Permit Date',
                          description: 'Learner\'s permit issue date cannot be in the future.',
                          variant: 'destructive',
                        });
                        return;
                      }
                    } else {
                      toast({
                        title: 'Invalid Permit Date',
                        description: 'Please enter a valid learner\'s permit date.',
                        variant: 'destructive',
                      });
                      return;
                    }
                  }
                  
                  if (currentStepFields.includes('hasLicenseAnotherCountry') || currentStepFields.includes('drivingExperience')) {
                    if (!form.hasLicenseAnotherCountry || !form.drivingExperience) {
                      toast({
                        title: 'Missing Information',
                        description: 'Please complete all permit and experience fields.',
                        variant: 'destructive',
                      });
                      return;
                    }
                  }
                  
                  if (currentStepFields.includes('password') || currentStepFields.includes('confirmPassword') || currentStepFields.includes('agreements')) {
                    if (!form.password || !form.confirmPassword || form.password !== form.confirmPassword || !form.agreements.every((a) => a !== null)) {
                      toast({
                        title: 'Security Required',
                        description: 'Please set a password and accept all agreements.',
                        variant: 'destructive',
                      });
                      return;
                    }
                  }
                  
                  // If all validations pass, proceed to next step
                  setStep(s => Math.min(steps.length-1, s+1));
                }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="px-8 order-1 sm:order-2"
                  disabled={!canSubmit || loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>
          <Separator />
          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-300">Already have an account? </span>
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Sign in</Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-center mt-8">
        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;
