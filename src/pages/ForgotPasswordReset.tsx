import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '@/redux/actions/authAction';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/redux/store';

const ForgotPasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Retrieve email and OTP from sessionStorage
    const storedEmail = sessionStorage.getItem('forgotPasswordEmail');
    const storedOtp = sessionStorage.getItem('forgotPasswordOTP');
    
    if (!storedEmail || !storedOtp) {
      toast({
        title: 'Error',
        description: 'Please start the password reset process again',
        variant: 'destructive',
      });
      navigate('/forgot-password');
      return;
    }
    
    setEmail(storedEmail);
    setOtp(storedOtp);
  }, [navigate, toast]);

  useEffect(() => {
    if (successMessage && submitted) {
      toast({
        title: 'Password Reset Successful',
        description: successMessage,
      });
      // Clear sessionStorage
      sessionStorage.removeItem('forgotPasswordEmail');
      sessionStorage.removeItem('forgotPasswordOTP');
      navigate('/login');
      setSubmitted(false);
    }
  }, [successMessage, submitted, navigate, toast]);

  useEffect(() => {
    if (error && submitted) {
      toast({
        title: 'Password Reset Failed',
        description: error,
        variant: 'destructive',
      });
      setSubmitted(false);
    }
  }, [error, submitted, toast]);

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    return requirements;
  };

  const getPasswordStrength = (password: string) => {
    const requirements = validatePassword(password);
    const passedRequirements = Object.values(requirements).filter(Boolean).length;
    return passedRequirements / Object.keys(requirements).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all password fields',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    const requirements = validatePassword(newPassword);
    const failedRequirements = Object.entries(requirements)
      .filter(([_, passed]) => !passed)
      .map(([name]) => {
        switch (name) {
          case 'length': return 'at least 8 characters';
          case 'uppercase': return 'one uppercase letter';
          case 'lowercase': return 'one lowercase letter';
          case 'number': return 'one number';
          case 'special': return 'one special character';
          default: return name;
        }
      });

    if (failedRequirements.length > 0) {
      toast({
        title: 'Weak Password',
        description: `Password must contain ${failedRequirements.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    if (!email || !otp) {
      toast({
        title: 'Error',
        description: 'Missing verification information. Please start over.',
        variant: 'destructive',
      });
      navigate('/forgot-password');
      return;
    }

    dispatch(resetPassword(email, otp, newPassword) as any);
    setSubmitted(true);
  };

  const requirements = validatePassword(newPassword);
  const strength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Fast Track Drivers Academy
            </Link>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Create your new password</p>
        </div>

        <Card className="shadow-xl border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md animate-slide-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white font-semibold">Reset Password</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400 font-medium">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300 font-medium">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password strength indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {Math.round(strength * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          strength <= 0.3 ? 'bg-red-500' :
                          strength <= 0.6 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${strength * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-500 text-sm">Passwords do not match</p>
                )}
              </div>

              {/* Password requirements */}
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  {Object.entries(requirements).map(([key, passed]) => (
                    <div key={key} className="flex items-center text-sm">
                      <CheckCircle
                        className={`h-3 w-3 mr-2 ${
                          passed ? 'text-green-500' : 'text-gray-400'
                        }`}
                      />
                      <span className={`text-gray-600 dark:text-gray-400 ${passed ? 'line-through' : ''}`}>
                        {key === 'length' && 'At least 8 characters'}
                        {key === 'uppercase' && 'One uppercase letter'}
                        {key === 'lowercase' && 'One lowercase letter'}
                        {key === 'number' && 'One number'}
                        {key === 'special' && 'One special character'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium" disabled={loading}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>

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

export default ForgotPasswordReset;
