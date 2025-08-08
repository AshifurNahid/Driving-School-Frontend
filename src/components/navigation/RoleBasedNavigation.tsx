import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useUser } from '@/contexts/UserContext';
import { 
  BookOpen, 
  User, 
  LogOut, 
  Settings, 
  Users, 
  BarChart3, 
  Calendar, 
  UserCog, 
  Menu, 
  X,
  Info,
  Mail,
  Home
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { SheetClose } from '../ui/sheet';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/actions/authAction';
import { Car, Shield, Star, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RoleBasedNavigationProps {
  currentPath?: string;
}

const RoleBasedNavigation = ({ currentPath }: RoleBasedNavigationProps) => {
  const { user, isAdmin, isLearner, switchRole } = useUser();
  const { userInfo } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);

  // Handle body scroll locking when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle animation states
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMenuAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsMenuAnimating(false);
      }, 300); // Match this with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  if (!user) return null;

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "w-full flex justify-start",
      isActive && "bg-accent text-accent-foreground"
    );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between h-16 sm:h-[72px] px-3 sm:px-6 lg:px-8">
            
            {/* Logo - Left Corner */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 lg:flex-initial">
              <NavLink 
                to="/" 
                className="flex items-center space-x-2 sm:space-x-3 group transition-all duration-300 hover:scale-[1.02] min-w-0"
                onClick={closeMobileMenu}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                    NL Driver's Academy
                  </h1>
                  <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                    Professional Driving Education
                  </p>
                </div>
              </NavLink>
            </div>

            {/* Desktop Navigation - Hidden on mobile/tablet */}
            <nav className="hidden xl:flex items-center">
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
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Role Badge - Hidden on small screens */}
              {userInfo && (
                <div className="hidden md:flex">
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

              {/* Authentication Section - Desktop */}
              {userInfo ? (
                <div className="hidden lg:flex items-center space-x-3">
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
                        <div className="hidden xl:block text-left">
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
                    className="h-11 px-4 xl:px-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut className="w-4 h-4 xl:mr-2" />
                    <span className="hidden xl:block">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  {/* Sign In */}
                  <Button 
                    variant="ghost" 
                    asChild
                    className="h-11 px-3 xl:px-5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-2xl font-medium transition-all duration-200"
                  >
                    <NavLink to="/login" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="hidden xl:block">Sign In</span>
                    </NavLink>
                  </Button>
                  
                  {/* Get Started */}
                  <Button 
                    asChild 
                    className="h-11 px-4 xl:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <NavLink to="/register" className="flex items-center space-x-2">
                      <Star className="w-4 h-4 xl:mr-2" />
                      <span className="hidden xl:block">Get Started</span>
                    </NavLink>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="h-10 w-10 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <div className="relative w-5 h-5">
                    <span className={`absolute top-1/2 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
                    <span className={`absolute top-1/2 left-0 w-5 h-0.5 bg-current transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                    <span className={`absolute top-1/2 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Menu Overlay - Using CSS for transitions */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden bg-black/0 backdrop-blur-0 pointer-events-none transition-all duration-300 ease-in-out ${
          isMenuAnimating ? 'block' : 'hidden'
        } ${isMobileMenuOpen ? 'bg-black/50 backdrop-blur-sm pointer-events-auto' : ''}`}
        onClick={closeMobileMenu}
      />
      
      {/* Menu Panel with slide animation */}
      <div 
        className={`fixed top-16 sm:top-[72px] right-0 left-0 z-40 lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ 
          maxHeight: 'calc(100vh - 72px)',
          overflowY: 'auto',
          overscrollBehavior: 'contain'
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          
          {/* Role Badge - Mobile */}
          {userInfo && (
            <div className="flex justify-center mb-6 md:hidden">
              <Badge 
                variant={isAdmin ? "default" : "secondary"} 
                className="h-8 px-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 dark:from-slate-700 dark:to-slate-600 dark:text-slate-200 border-0 font-semibold text-xs tracking-wide"
              >
                <Shield className="w-3 h-3 mr-1.5" />
                {userInfo.role?.title === 'Admin' ? "ADMIN" : "LEARNER"}
              </Badge>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-2 mb-6">
            {/* Mobile nav links with improved transitions */}
            <Button 
              variant="ghost" 
              asChild 
              className="w-full h-12 justify-start text-base font-medium rounded-xl transition-all duration-200 transform hover:translate-x-1 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              onClick={closeMobileMenu}
            >
              <NavLink to="/courses" className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5" />
                <span>Courses</span>
              </NavLink>
            </Button>
            
            <Button 
              variant="ghost" 
              asChild 
              className="w-full h-12 justify-start text-base font-medium rounded-xl transition-all duration-200 transform hover:translate-x-1 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              onClick={closeMobileMenu}
            >
              <NavLink to="/about" className="flex items-center space-x-3">
                <Info className="h-5 w-5" />
                <span>About</span>
              </NavLink>
            </Button>
            
            <Button 
              variant="ghost" 
              asChild 
              className="w-full h-12 justify-start text-base font-medium rounded-xl transition-all duration-200 transform hover:translate-x-1 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              onClick={closeMobileMenu}
            >
              <NavLink to="/contact" className="flex items-center space-x-3">
                <Mail className="h-5 w-5" />
                <span>Contact</span>
              </NavLink>
            </Button>

            {userInfo && userInfo.role?.title === 'Admin' && (
              <Button 
                variant="ghost" 
                asChild 
                className="w-full h-12 justify-start text-base font-medium hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 rounded-xl"
                onClick={closeMobileMenu}
              >
                <NavLink to="/admin" className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5" />
                  <span>Dashboard</span>
                </NavLink>
              </Button>
            )}

            {userInfo && userInfo.role?.title !== 'Admin' && (
              <>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full h-12 justify-start text-base font-medium hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 rounded-xl"
                  onClick={closeMobileMenu}
                >
                  <NavLink to="/learner/courses" className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5" />
                    <span>My Courses</span>
                  </NavLink>
                </Button>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full h-12 justify-start text-base font-medium hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 rounded-xl"
                  onClick={closeMobileMenu}
                >
                  <NavLink to="/appointments" className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5" />
                    <span>Appointments</span>
                  </NavLink>
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    navigate("/learner/profile");
                    closeMobileMenu();
                  }}
                  className="w-full h-12 justify-start text-base font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        userInfo.user_detail?.image_path ||
                        "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInfo.full_name) + "&background=6366f1&color=ffffff&size=20&rounded=true"
                      }
                      alt="Profile"
                      className="w-5 h-5 rounded-lg"
                    />
                    <span>My Profile</span>
                  </div>
                </Button>
              </>
            )}
          </nav>

          {/* Authentication Section - Mobile */}
          {userInfo ? (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                onClick={handleLogout}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <Button 
                variant="ghost" 
                asChild
                className="w-full h-12 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-xl font-medium transition-all duration-200 transform hover:translate-x-1"
                onClick={closeMobileMenu}
              >
                <NavLink to="/login" className="flex items-center justify-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </NavLink>
              </Button>
              
              <Button 
                asChild 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                onClick={closeMobileMenu}
              >
                <NavLink to="/register" className="flex items-center justify-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Get Started</span>
                </NavLink>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoleBasedNavigation;