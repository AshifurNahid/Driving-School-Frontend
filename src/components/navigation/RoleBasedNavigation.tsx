import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useUser } from '@/contexts/UserContext';
import { BookOpen, User, LogOut, Settings, Users, BarChart3, Calendar, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { SheetClose } from '../ui/sheet';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/actions/authAction';

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
  <header className="bg-card shadow-sm border-b border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        
        {/* Left side - Logo */}
        <div className="flex items-center">
          <NavLink to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            NL Driving
          </NavLink>
        </div>

        {/* Middle - Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" asChild>
            <NavLink to="/courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Courses
            </NavLink>
          </Button>
          <Button variant="ghost" asChild>
            <NavLink to="/about">About</NavLink>
          </Button>
          <Button variant="ghost" asChild>
            <NavLink to="/contact">Contact</NavLink>
          </Button>

          {userInfo && userInfo.role?.title === 'Admin' && (
            <Button variant="ghost" asChild>
              <NavLink to="/admin">
                <BarChart3 className="h-4 w-4 mr-2" />
                Admin Dashboard
              </NavLink>
            </Button>
          )}

          {userInfo && userInfo.role?.title !== 'Admin' && (
            <>
              <Button variant="ghost" asChild>
                <NavLink to="/learner/courses">
                  <BookOpen className="h-4 w-4 mr-2" />
                  My Courses
                </NavLink>
              </Button>
              <Button variant="ghost" asChild>
                <NavLink to="/appointments">
                  <Calendar className="h-4 w-4 mr-2" />
                  Appointments
                </NavLink>
              </Button>
            </>
          )}
        </nav>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {userInfo && (
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {userInfo.role?.title === 'Admin' ? "Admin" : "Learner"}
            </Badge>
          )}

          <ThemeToggle />

          {userInfo ? (
            <>
              {userInfo.role?.title !== 'Admin' && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/learner/profile")}
                >
                  <img
                    src={
                      userInfo.user_detail?.image_path ||
                      "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInfo.full_name)
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2 inline-block"
                  />
                </Button>
              )}
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium"
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <NavLink to="/login">Sign In</NavLink>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium">
                <NavLink to="/register">Get Started</NavLink>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  </header>
);

};

export default RoleBasedNavigation;
