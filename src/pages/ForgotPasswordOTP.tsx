import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP } from '@/redux/actions/authAction';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/redux/store';

const ForgotPasswordOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Retrieve email from sessionStorage
    const storedEmail = sessionStorage.getItem('forgotPasswordEmail');
    if (!storedEmail) {
      toast({
        title: 'Error',
        description: 'Please start the password reset process again',
        variant: 'destructive',
      });
      navigate('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate, toast]);

  useEffect(() => {
    if (successMessage && submitted) {
      toast({
        title: 'OTP Verified',
        description: successMessage,
      });
      // Store OTP in sessionStorage for use in reset step
      sessionStorage.setItem('forgotPasswordOTP', otp.join(''));
      navigate('/forgot-password/reset');
      setSubmitted(false);
    }
  }, [successMessage, submitted, navigate, toast, otp]);

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

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single character
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').map((char, index) => (index < 6 ? char : ''));
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    
    // Focus the last filled input
    const lastFilledIndex = newOtp.filter(char => char !== '').length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 5) {
      const nextInput = document.getElementById(`otp-${lastFilledIndex + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast({
        title: 'Validation Error',
        description: 'Please enter all 6 digits',
        variant: 'destructive',
      });
      return;
    }

    if (!email) {
      toast({
        title: 'Error',
        description: 'Email not found. Please start over.',
        variant: 'destructive',
      });
      navigate('/forgot-password');
      return;
    }

    dispatch(verifyOTP(email, otpString) as any);
    setSubmitted(true);
  };

  const handleResendCode = () => {
    // Navigate back to email page to resend
    sessionStorage.removeItem('forgotPasswordOTP');
    navigate('/forgot-password');
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
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Verify your identity</p>
        </div>

        <Card className="shadow-xl border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md animate-slide-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white font-semibold">Enter Verification Code</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400 font-medium">
              We've sent a 6-digit code to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-medium">Verification Code</Label>
                <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </form>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResendCode}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend Code
              </Button>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Remember your password? </span>
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to="/forgot-password" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Email Entry
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOTP;
