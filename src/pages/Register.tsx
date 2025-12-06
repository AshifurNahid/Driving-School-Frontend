
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '@/redux/actions/authAction';
import { getAdminRegionList } from '@/redux/actions/adminAction';
import { useToast } from '@/hooks/use-toast';

import { RootState } from '@/redux/store';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const BIRTH_YEAR_FROM = 1920;
const BIRTH_YEAR_TO = new Date().getFullYear() - 12;
const MIN_PHONE_DIGITS = 10;
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redux selectors
  const { regions } = useSelector((state: RootState) => state.regionList);
  const { loading, error } = useAuth();

  useEffect(() => {
    if (!regions || regions.length === 0) { dispatch(getAdminRegionList() as any); }
  }, [dispatch, regions]);

  const years = Array.from({length: BIRTH_YEAR_TO - BIRTH_YEAR_FROM + 1}, (_, i) => (BIRTH_YEAR_TO - i).toString());
  const days = Array.from({length: 31}, (_, i) => (i+1).toString());
  const permitYears = Array.from({length: 40}, (_, i) => (new Date().getFullYear() - i).toString());

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
      const studentDigits = (form.studentPhone || '').replace(/\D/g, '');
      return !!form.studentEmail && studentDigits.length >= MIN_PHONE_DIGITS;
    } else if (s.includes('address1')) {
      return !!form.address1 && !!form.city && !!form.state && !!form.postal;
    } else if (s.includes('regionId')) {
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
      if (age < 16) {
        toast({
          title: 'Invalid Date of Birth',
          description: 'You must be at least 16 years old to register.',
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
      birth_date: { year: form.birthYear, month: form.birthMonth, day: form.birthDay },
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
      learners_permit_issue_date: { year: form.permitYear, month: form.permitMonth, day: form.permitDay },
      has_license_from_another_country: form.hasLicenseAnotherCountry,
      driving_experience: form.drivingExperience,
      password: form.password,
      confirm_password: form.confirmPassword,
      agreements: {
        paid_policy: form.agreements[0] === true,
        completion_policy: form.agreements[1] === true,
        instructor_ready_policy: form.agreements[2] === true,
        refund_policy: form.agreements[3] === true,
      }
    };
    dispatch(register(payload) as any);
    if (!loading && error == null) {
      toast({ title: 'Registration Successful', description: 'You can now sign in with your credentials.' });
      navigate('/login');
    }
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
            <Label className="block text-sm font-medium text-gray-700 mb-1">Please choose a location <span className="text-red-500">*</span></Label>
            <Select value={form.regionId} onValueChange={val => handleFieldChange('regionId', val)}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Please Select" /></SelectTrigger>
              <SelectContent>{regions?.map(r => <SelectItem key={r.id} value={r.id?.toString() || ''}>{r.region_name || `Region ${r.id}`}</SelectItem>)}</SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2 mt-6">
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></Label>
                <Input placeholder="First Name" value={form.firstName} onChange={e => handleFieldChange('firstName', e.target.value)} />
              </div>
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></Label>
                <Input placeholder="Last Name" value={form.lastName} onChange={e => handleFieldChange('lastName', e.target.value)} />
              </div>
            </div>
            <Label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Date of Birth <span className="text-red-500">*</span></Label>
            <div className="mt-1 border rounded-md p-2 bg-white">
              <DayPicker
                mode="single"
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
                captionLayout="dropdown"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div style={stepFadeStyle}>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></Label>
            <div className="flex flex-col mt-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></Label>
              <Input placeholder="Street Address" value={form.address1} onChange={e => handleFieldChange('address1', e.target.value)} />
            </div>
            <div className="flex flex-col mt-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">Street Address Line 2 (optional)</Label>
              <Input placeholder="Street Address Line 2 (optional)" value={form.address2} onChange={e => handleFieldChange('address2', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></Label>
                <Input placeholder="City" value={form.city} onChange={e => handleFieldChange('city', e.target.value)} />
              </div>
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 mb-1">State / Province <span className="text-red-500">*</span></Label>
                <Input placeholder="State / Province" value={form.state} onChange={e => handleFieldChange('state', e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">Postal / Zip Code <span className="text-red-500">*</span></Label>
              <Input placeholder="Postal / Zip Code" value={form.postal} onChange={e => handleFieldChange('postal', e.target.value)} />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={stepFadeStyle}>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Contact Information <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 mb-1">Student's E-mail <span className="text-red-500">*</span></Label>
                <Input type="email" placeholder="Student's E-mail" value={form.studentEmail} onChange={e => handleFieldChange('studentEmail', e.target.value)} />
              </div>
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 mb-1">Parent's E-mail (optional)</Label>
                <Input type="email" placeholder="Parent's E-mail (optional)" value={form.parentEmail} onChange={e => handleFieldChange('parentEmail', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 mb-1">Student Phone <span className="text-red-500">*</span></Label>
                <PhoneInput
                  international
                  defaultCountry="CA"
                  value={form.studentPhone}
                  onChange={val => handleFieldChange('studentPhone', val || '')}
                  className="border rounded-md px-3 py-2 text-sm bg-white"
                />
              </div>
              <div className="flex flex-col">
                <Label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Phone (optional)</Label>
                <PhoneInput
                  international
                  defaultCountry="CA"
                  value={form.parentPhone}
                  onChange={val => handleFieldChange('parentPhone', val || '')}
                  className="border rounded-md px-3 py-2 text-sm bg-white"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={stepFadeStyle}>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Learner's Permit Issue Date <span className="text-red-500">*</span></Label>
            <div className="mt-2 border rounded-md p-2 bg-white">
              <DayPicker
                mode="single"
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
                captionLayout="dropdown"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Date cannot be in the future.</p>
            <div className="mt-5">
              <Label className="block text-sm font-medium text-gray-700 mb-1">Do you have a driver licence from another country? <span className="text-red-500">*</span></Label>
              <Select value={form.hasLicenseAnotherCountry} onValueChange={val => handleFieldChange('hasLicenseAnotherCountry', val)}>
                <SelectTrigger><SelectValue placeholder="Please Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3">
              <Label className="block text-sm font-medium text-gray-700 mb-1">How much driving experience do you have? <span className="text-red-500">*</span></Label>
              <Select value={form.drivingExperience} onValueChange={val => handleFieldChange('drivingExperience', val)}>
                <SelectTrigger><SelectValue placeholder="Please Select" /></SelectTrigger>
                <SelectContent>
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
            <Label className="block text-sm font-medium text-gray-700 mb-2">Account Security & Agreements <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input
                  id="password" name="password" type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password} onChange={e => handleFieldChange('password', e.target.value)}
                  className="pl-10 pr-10 mt-1" required
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
                <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                <Input
                  id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={form.confirmPassword} onChange={e => handleFieldChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 mt-1" required
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
              <div className="block text-sm font-medium text-gray-700">Agreements <span className="text-red-500">*</span></div>
              {AGREE_TEXTS.map((text, i) => (
                <div key={i} className="mb-2">
                  <span className="text-xs">{i + 1}. {text}</span>
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
                      <Label htmlFor={`agree${i}`}>I AGREE</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem id={`disagree${i}`} value="disagree" className="mr-2" />
                      <Label htmlFor={`disagree${i}`}>I DO NOT AGREE</Label>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col items-center py-8 px-2">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 bg-clip-text text-transparent">Welcome to NL Driving Academy</h1>
        <div className="text-lg text-gray-700 font-medium">Let’s get you started — {steps.length} quick steps!</div>
      </div>
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 text-sm">
            {steps.map((s, idx) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className={`rounded-full w-7 h-7 flex items-center justify-center text-white font-bold text-xs
                  ${idx === step ? 'bg-blue-500' : idx < step ? 'bg-green-400' : 'bg-gray-300'}
                `}>{idx + 1}</span>{idx < steps.length-1 && <div className="h-1 w-6 bg-gray-300 rounded" />}
              </div>
            ))}
          </div>
          <CardTitle className="text-xl text-center">Step {step + 1}: {steps[step].label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit}>
            {renderStepContent(step)}
            <div className="flex justify-between gap-3 mt-8">
              <Button type="button" variant="secondary" className="px-8" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s-1))}>
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button
                  type="button"
                  className="px-8"
                  disabled={!fieldsValidFor(step)}
                  onClick={() => fieldsValidFor(step) && setStep(s => Math.min(steps.length-1, s+1))}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="px-8"
                  disabled={!canSubmit || loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>
          <Separator />
          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-center mt-8">
        <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;
