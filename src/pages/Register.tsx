
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '@/redux/actions/authAction';
import { getAdminRegionList } from '@/redux/actions/adminAction';
import { getCourses } from '@/redux/actions/courseAction';
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

const BIRTH_YEAR_FROM = 1920;
const BIRTH_YEAR_TO = new Date().getFullYear() - 12;
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const steps = [
  { label: 'Location & Personal', fields: [ 'regionId', 'firstName', 'lastName', 'birthYear', 'birthMonth', 'birthDay' ] },
  { label: 'Address', fields: [ 'address1', 'address2', 'city', 'state', 'postal' ] },
  { label: 'Contact', fields: [ 'studentEmail', 'parentEmail', 'studentPhone', 'parentPhone' ] },
  { label: 'Permit & Course', fields: [ 'permitYear', 'permitMonth', 'permitDay', 'hasLicenseAnotherCountry', 'drivingExperience', 'courseId' ] },
  { label: 'Security & Agreements', fields: [ 'password', 'confirmPassword', 'agreements' ] }
];

const Register = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    regionId: '', firstName: '', lastName: '', birthYear: '', birthMonth: '', birthDay: '',
    address1: '', address2: '', city: '', state: '', postal: '',
    studentEmail: '', parentEmail: '', studentPhone: '', parentPhone: '',
    permitYear: '', permitMonth: '', permitDay: '',
    hasLicenseAnotherCountry: '', drivingExperience: '', courseId: '',
    password: '', confirmPassword: '', agreements: [false, false, false, false],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redux selectors
  const { regions } = useSelector((state: RootState) => state.regionList);
  const { courses } = useSelector((state: RootState) => state.guest_course);
  const { loading, error } = useAuth();

  useEffect(() => {
    if (!regions || regions.length === 0) { dispatch(getAdminRegionList() as any); }
    if (!courses || courses.length === 0) { dispatch(getCourses(1, 30) as any); }
  }, [dispatch, regions, courses]);

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
    // const s = steps[stepIdx].fields;
    // if (s.includes('agreements')) {
    //   return [form.password, form.confirmPassword, ...form.agreements].every(Boolean) && form.password === form.confirmPassword;
    // } else if (s.includes('studentEmail')) {
    //   return form.studentEmail && form.studentPhone; // keep email & phone required for demo
    // } else if (s.includes('address1')) {
    //   return form.address1 && form.city && form.state && form.postal;
    // } else if (s.includes('regionId')) {
    //   return form.regionId && form.firstName && form.lastName && form.birthYear && form.birthMonth && form.birthDay;
    // } else if (s.includes('permitYear')) {
    //   return form.permitYear && form.permitMonth && form.permitDay && form.hasLicenseAnotherCountry && form.drivingExperience && form.courseId;
    // }
    return true;
  }

  // Final validation
  const canSubmit = fieldsValidFor(steps.length-1) && steps.slice(0, -1).every((_, i) => fieldsValidFor(i));

  // Animate step transitions (simple fade)
  const stepFadeStyle = {
    transition: 'opacity .25s',
    opacity: 1,
    animation: 'fadeIn .7s'
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
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
      course_id: form.courseId,
      password: form.password,
      confirm_password: form.confirmPassword,
      agreements: {
        paid_policy: form.agreements[0],
        completion_policy: form.agreements[1],
        instructor_ready_policy: form.agreements[2],
        refund_policy: form.agreements[3],
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
    switch(idx) {
      case 0:
        return (
          <div style={stepFadeStyle}>
            <Label className="font-semibold text-lg mb-1">Please choose a location</Label>
            <Select value={form.regionId} onValueChange={val => handleFieldChange('regionId', val)}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Please Select" /></SelectTrigger>
              <SelectContent>{regions?.map(r => <SelectItem key={r.id} value={r.id?.toString() || ''}>{r.region_name || `Region ${r.id}`}</SelectItem>)}</SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2 mt-6">
              <Input placeholder="First Name" value={form.firstName} onChange={e => handleFieldChange('firstName', e.target.value)} />
              <Input placeholder="Last Name" value={form.lastName} onChange={e => handleFieldChange('lastName', e.target.value)} />
            </div>
            <label htmlFor="">Date of Birth</label>

            <div className="flex gap-2 mt-4">
              <Select value={form.birthYear} onValueChange={val => handleFieldChange('birthYear', val)}>
                <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.birthMonth} onValueChange={val => handleFieldChange('birthMonth', val)}>
                <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent>{MONTHS.map((m, i) => <SelectItem key={i} value={(i+1)+''}>{m}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.birthDay} onValueChange={val => handleFieldChange('birthDay', val)}>
                <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        );
      case 1:
        return (
          <div style={stepFadeStyle}>
            <Label className="font-semibold text-lg mb-1">Address</Label>
            <Input className="mt-2" placeholder="Street Address" value={form.address1} onChange={e => handleFieldChange('address1', e.target.value)} />
            <Input className="mt-2" placeholder="Street Address Line 2 (optional)" value={form.address2} onChange={e => handleFieldChange('address2', e.target.value)} />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Input placeholder="City" value={form.city} onChange={e => handleFieldChange('city', e.target.value)} />
              <Input placeholder="State / Province" value={form.state} onChange={e => handleFieldChange('state', e.target.value)} />
            </div>
            <Input className="mt-2" placeholder="Postal / Zip Code" value={form.postal} onChange={e => handleFieldChange('postal', e.target.value)} />
          </div>
        );
      case 2:
        return (
          <div style={stepFadeStyle}>
            <Label className="font-semibold text-lg mb-1">Contact Information</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Input type="email" placeholder="Student's E-mail" value={form.studentEmail} onChange={e => handleFieldChange('studentEmail', e.target.value)} />
              <Input type="email" placeholder="Parent's E-mail (optional)" value={form.parentEmail} onChange={e => handleFieldChange('parentEmail', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Input placeholder="Student Phone" value={form.studentPhone} onChange={e => handleFieldChange('studentPhone', e.target.value)} />
              <Input placeholder="Parent/Guardian Phone (optional)" value={form.parentPhone} onChange={e => handleFieldChange('parentPhone', e.target.value)} />
            </div>
          </div>
        );
      case 3:
        return (
          <div style={stepFadeStyle}>
            <Label className="font-semibold text-lg mb-1">Permit, Experience & Course</Label>
            <div className="flex gap-2 mt-2">
              <Select value={form.permitYear} onValueChange={val => handleFieldChange('permitYear', val)}>
                <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>{permitYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.permitMonth} onValueChange={val => handleFieldChange('permitMonth', val)}>
                <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent>{MONTHS.map((m, i) => <SelectItem key={i} value={(i+1)+''}>{m}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.permitDay} onValueChange={val => handleFieldChange('permitDay', val)}>
                <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="mt-5">
              <Label>Do you have a driver licence from another country?</Label>
              <Select value={form.hasLicenseAnotherCountry} onValueChange={val => handleFieldChange('hasLicenseAnotherCountry', val)}>
                <SelectTrigger><SelectValue placeholder="Please Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3">
              <Label>How much driving experience do you have?</Label>
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
            <div className="mt-3">
              <Label>Course Choice</Label>
              <Select value={form.courseId} onValueChange={val => handleFieldChange('courseId', val)}>
                <SelectTrigger><SelectValue placeholder="Please Select" /></SelectTrigger>
                <SelectContent>{courses?.map(course => (
                  <SelectItem key={course.id} value={course.id?.toString() || ''}>{course.title || `Course ${course.id}`}</SelectItem>
                ))}</SelectContent>
              </Select>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={stepFadeStyle}>
            <Label className="font-semibold text-lg mb-2">Account Security & Agreements</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Label htmlFor="password">Password</Label>
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
                <Label htmlFor="confirmPassword">Confirm Password</Label>
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
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="font-semibold">Agreements <span className="text-red-500">*</span></div>
              {AGREE_TEXTS.map((text, i) => (
                <div key={i} className="mb-2">
                  <span className="text-xs">{i + 1}. {text}</span>
                  <RadioGroup className="flex space-x-6 mt-1"
                    value={form.agreements[i] ? 'agree' : ''} onValueChange={val => handleAgreement(i, val)}>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem id={`agree${i}`} value="agree" className="mr-2" />
                      <Label htmlFor={`agree${i}`}>I AGREE</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem id={`disagree${i}`} value="disagree" className="mr-2" />
                      <Label htmlFor={`disagree${i}`}>I DISAGREE</Label>
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
                  // disabled={!fieldsValidFor(step)}
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
