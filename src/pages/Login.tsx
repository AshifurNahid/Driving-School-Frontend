import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { forgotPassword, login } from '@/redux/actions/authAction';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, error, userInfo } = useAuth();

  useEffect(() => {
    if (userInfo) {
      if (!userInfo.is_email_verified) {
        setNeedsVerification(true);
        toast({
          title: 'Email Not Verified',
          description: 'Please verify your email to continue.',
          variant: 'destructive'
        });
        return;
      }
      setNeedsVerification(false);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userInfo.full_name}!`
      });
      if(userInfo.role.title === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [userInfo, navigate, toast]);

  // Show error toast when Redux error is set (now prioritizes status.message)
  useEffect(() => {
    if (error && submitted) {
      toast({ title: 'Login Failed', description: error, variant: 'destructive' });
      setSubmitted(false);
    }
  }, [error, submitted, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(email, password) as any);
    setSubmitted(true);
  };

  const handleSendVerification = async () => {
    const targetEmail = userInfo?.email || email;

    if (!targetEmail) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setVerificationLoading(true);
      await dispatch(forgotPassword(targetEmail) as any);
      sessionStorage.setItem('verificationEmail', targetEmail);
      sessionStorage.setItem('verificationContext', 'login');
      toast({
        title: 'Verification Code Sent',
        description: `A verification code has been sent to ${targetEmail}.`,
      });
      navigate('/register/verify');
    } catch (err: any) {
      toast({
        title: 'Unable to send code',
        description: err.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setVerificationLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Fast Track Drivers Academy            </Link>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Welcome back to your learning journey</p>
        </div>

        <Card className="shadow-xl border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md animate-slide-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white font-semibold">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400 font-medium">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400 font-medium">Remember me</Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

             {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {needsVerification && (
              <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/30 dark:text-yellow-100 space-y-3">
                <div className="text-sm font-medium">
                  Your email address is not verified. Please verify to access your account.
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-yellow-300 text-yellow-800 dark:border-yellow-700 dark:text-yellow-100"
                  onClick={handleSendVerification}
                  disabled={verificationLoading}
                >
                  {verificationLoading ? 'Sending Code...' : 'Verify Email'}
                </Button>
              </div>
            )}

            <Separator className="bg-gray-200 dark:bg-gray-700" />

        

            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Don't have an account? </span>
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
