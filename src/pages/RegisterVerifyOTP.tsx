import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyRegistrationOTP, resendRegistrationOTP } from '@/redux/actions/authAction';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/redux/store';

const RegisterVerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resending, setResending] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);

  // Get email from sessionStorage
  const registrationEmail = sessionStorage.getItem('registrationEmail') || '';

  useEffect(() => {
    // Redirect if no email in session
    if (!registrationEmail) {
      toast({
        title: 'Session Expired',
        description: 'Please register again.',
        variant: 'destructive',
      });
      navigate('/register');
    }
  }, [registrationEmail, navigate, toast]);

  useEffect(() => {
    if (successMessage && submitted) {
      toast({
        title: 'Verification Successful',
        description: successMessage,
      });
      // Clear email from sessionStorage
      sessionStorage.removeItem('registrationEmail');
      navigate('/login');
      setSubmitted(false);
    }
  }, [successMessage, submitted, navigate, toast]);

  useEffect(() => {
    if (error && submitted) {
      toast({
        title: 'Verification Failed',
        description: error,
        variant: 'destructive',
      });
      setSubmitted(false);
    }
  }, [error, submitted, toast]);

  useEffect(() => {
    if (successMessage && resending) {
      toast({
        title: 'Code Resent',
        description: 'A new verification code has been sent to your email.',
      });
      setResending(false);
    }
  }, [successMessage, resending, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter the verification code',
        variant: 'destructive',
      });
      return;
    }
    dispatch(verifyRegistrationOTP(registrationEmail, otp) as any);
    setSubmitted(true);
  };

  const handleResend = () => {
    dispatch(resendRegistrationOTP(registrationEmail) as any);
    setResending(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NL Driving
            </Link>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Verify your email address</p>
        </div>

        <Card className="shadow-xl border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md animate-slide-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white font-semibold">Email Verification</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400 font-medium">
              We've sent a verification code to <strong>{registrationEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-700 dark:text-gray-300 font-medium">Verification Code</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-medium text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium" disabled={loading || otp.length !== 6}>
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={loading || resending}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? 'Resending...' : "Didn't receive the code? Resend"}
              </button>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Wrong email? </span>
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Register again
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to="/register" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterVerifyOTP;