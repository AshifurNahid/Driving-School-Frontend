
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useUser } from '@/contexts/UserContext';
import { BookOpen, User, LogOut, Settings, Users, BarChart3, Calendar, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RoleBasedNavigationProps {
  currentPath?: string;
}

const RoleBasedNavigation = ({ currentPath }: RoleBasedNavigationProps) => {
  const { user, isAdmin, isLearner, switchRole } = useUser();

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
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduPlatform
            </NavLink>
          </div>
          
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

            {isLearner && (
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
                <Button variant="ghost" asChild>
                  <NavLink to="/learner/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </NavLink>
                </Button>
              </>
            )}
            
            {isAdmin && (
              <>
                <Button variant="ghost" asChild>
                  <NavLink to="/admin">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </NavLink>
                </Button>
                <Button variant="ghost" asChild>
                  <NavLink to="/dashboard">
                    <Users className="h-4 w-4 mr-2" />
                    Instructor Dashboard
                  </NavLink>
                </Button>
                <Button variant="ghost" asChild>
                  <NavLink to="/appointments">
                    <Calendar className="h-4 w-4 mr-2" />
                    Appointments
                  </NavLink>
                </Button>
                <Button variant="ghost" asChild>
                  <NavLink to="/upload-course">
                    <Settings className="h-4 w-4 mr-2" />
                    Upload Course
                  </NavLink>
                </Button>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Role Switcher for Demo */}
            <div className="flex items-center space-x-2">
              <Badge variant={isAdmin ? "default" : "secondary"}>
                {isAdmin ? "Admin" : "Learner"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchRole(isAdmin ? 'learner' : 'admin')}
                className="text-xs"
              >
                <UserCog className="h-3 w-3 mr-1" />
                Switch to {isAdmin ? 'Learner' : 'Admin'}
              </Button>
            </div>
            
            <ThemeToggle />
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RoleBasedNavigation;
