import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useUser } from '@/contexts/UserContext';
import { BookOpen, User, LogOut, Settings, Users, BarChart3, Calendar, UserCog, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/actions/authAction';
import { Car, Shield, Star } from 'lucide-react';

interface RoleBasedNavigationProps {
  currentPath?: string;
}

const RoleBasedNavigation = ({ currentPath }: RoleBasedNavigationProps) => {
  const { user, isAdmin, isLearner, switchRole } = useUser();
  const { userInfo } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate("/login");
  };
  
  if (!user) return null;

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "w-full flex justify-start",
      isActive && "bg-accent text-accent-foreground"
    );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between h-[72px] px-6 lg:px-8">
          
          {/* Logo - Left Corner */}
          <div className="flex items-center space-x-3">
            <NavLink 
              to="/" 
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  NL Driver's Academy
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                  Professional Driving Education
                </p>
              </div>
            </NavLink>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-1 space-x-1">
              <Button 
                variant="ghost" 
                asChild 
                className="h-10 px-4 rounded-xl text-sm font-medium hover:bg-white hover:shadow-sm dark:hover:bg-slate-700 transition-all duration-200 data-[active]:bg-white data-[active]:shadow-sm dark:data-[active]:bg-slate-700"
              >
                <NavLink to="/courses" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Courses</span>
                </NavLink>
              </Button>
              
              <Button 
                variant="ghost" 
                asChild 
                className="h-10 px-4 rounded-xl text-sm font-medium hover:bg-white hover:shadow-sm dark:hover:bg-slate-700 transition-all duration-200"
              >
                <NavLink to="/about">About</NavLink>
              </Button>
              
              <Button 
                variant="ghost" 
                asChild 
                className="h-10 px-4 rounded-xl text-sm font-medium hover:bg-white hover:shadow-sm dark:hover:bg-slate-700 transition-all duration-200"
              >
                <NavLink to="/contact">Contact</NavLink>
              </Button>

              {userInfo && userInfo.role?.title === 'Admin' && (
                <Button 
                  variant="ghost" 
                  asChild 
                  className="h-10 px-4 rounded-xl text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 transition-all duration-200"
                >
                  <NavLink to="/admin" className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </NavLink>
                </Button>
              )}

              {userInfo && userInfo.role?.title !== 'Admin' && (
                <>
                  <Button 
                    variant="ghost" 
                    asChild 
                    className="h-10 px-4 rounded-xl text-sm font-medium hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-all duration-200"
                  >
                    <NavLink to="/learner/courses" className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>My Courses</span>
                    </NavLink>
                  </Button>
                  <Button 
                    variant="ghost" 
                    asChild 
                    className="h-10 px-4 rounded-xl text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-all duration-200"
                  >
                    <NavLink to="/appointments" className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Appointments</span>
                    </NavLink>
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            {userInfo && (
              <div className="hidden sm:flex">
                <Badge 
                  variant={isAdmin ? "default" : "secondary"} 
                  className="h-8 px-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 dark:from-slate-700 dark:to-slate-600 dark:text-slate-200 border-0 font-semibold text-xs tracking-wide"
                >
                  <Shield className="w-3 h-3 mr-1.5" />
                  {userInfo.role?.title === 'Admin' ? "ADMIN" : "LEARNER"}
                </Badge>
              </div>
            )}

            {/* Theme Toggle */}
            <div className="p-1">
              <ThemeToggle />
            </div>

            {/* Authentication Section */}
            {userInfo ? (
              <div className="flex items-center space-x-3">
                {/* User Profile */}
                {userInfo.role?.title !== 'Admin' && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/learner/profile")}
                    className="h-11 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          userInfo.user_detail?.image_path ||
                          "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInfo.full_name) + "&background=6366f1&color=ffffff&size=32&rounded=true"
                        }
                        alt="Profile"
                        className="w-8 h-8 rounded-xl ring-2 ring-slate-200 dark:ring-slate-600 group-hover:ring-slate-300 dark:group-hover:ring-slate-500 transition-all duration-200"
                      />
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                          {userInfo.full_name?.split(' ')[0] || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          View Profile
                        </p>
                      </div>
                    </div>
                  </Button>
                )}
                
                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  className="h-11 px-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:block">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Sign In */}
                <Button 
                  variant="ghost" 
                  asChild
                  className="h-11 px-5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-2xl font-medium transition-all duration-200"
                >
                  <NavLink to="/login" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </NavLink>
                </Button>
                
                {/* Get Started */}
                <Button 
                  asChild 
                  className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <NavLink to="/register" className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Get Started</span>
                  </NavLink>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                className="h-10 w-10 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RoleBasedNavigation;