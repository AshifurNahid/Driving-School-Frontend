import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { logout } from '@/redux/actions/authAction';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  BookOpen,
  Home,
  Calendar,
  UserCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  DollarSign,
  LogOut,
  Grid3X3,
  Navigation,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
}

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  appointmentActiveTab?: string;
  onAppointmentTabChange?: (tabId: string) => void;
  className?: string;
}

const AdminSidebar = ({
  activeTab,
  onTabChange,
  appointmentActiveTab,
  onAppointmentTabChange,
  className
}: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [appointmentExpanded, setAppointmentExpanded] = useState(activeTab === 'appointments');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const sidebarItems: SidebarItem[] = [
    { id: 'overview', label: 'Dashboard', icon: Grid3X3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'course-list', label: 'Courses', icon: BookOpen },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'instructors', label: 'Instructors', icon: UserCheck },
    { id: 'region', label: 'Regions', icon: Navigation },
  ];

  const appointmentSubItems = [
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'requests', label: 'Requests', icon: FileText },
    { id: 'pricing', label: 'Pricing', icon: DollarSign }
  ];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (activeTab === 'appointments') {
      setAppointmentExpanded(true);
    }
  }, [activeTab]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleItemClick = (itemId: string) => {
    if (itemId === 'appointments') {
      setAppointmentExpanded((prev) => !prev);
      onTabChange(itemId);
    } else {
      setAppointmentExpanded(false);
      onTabChange(itemId);
    }

    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleAppointmentSubItemClick = (subItemId: string) => {
    onAppointmentTabChange?.(subItemId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const collapsed = !isOpen;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-gradient-to-b from-white via-blue-50/60 to-white text-slate-700",
          "shadow-2xl border-r border-slate-200/80 backdrop-blur-xl flex flex-col z-50 transition-all duration-300 lg:static",
          isOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0",
          className
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200/70">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 shadow-md flex items-center justify-center text-white font-semibold">
                NL
              </div>
              <div className="leading-tight">
                <p className="text-sm text-slate-500 font-semibold">Dashboard</p>
                <p className="text-lg font-bold text-slate-800">NL Driving</p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-9 w-9 rounded-full border border-slate-200 bg-white/80 hover:bg-white shadow-sm text-slate-500"
          >
            {isMobile ? (
              <X className="h-4 w-4" />
            ) : isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-4 pb-6 space-y-6">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/70 border border-slate-200/70 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 grid place-items-center font-semibold">NL</div>
            {isOpen && (
              <div className="flex-1">
                <p className="text-xs text-slate-500">Quick View</p>
                <p className="text-base font-semibold text-slate-800">Admin Panel</p>
              </div>
            )}
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isAppointments = item.id === 'appointments';

              return (
                <div key={item.id} className="space-y-2">
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                      collapsed ? "justify-center px-2.5 py-3" : "px-3 py-2.5",
                      isActive
                        ? "bg-white shadow-md border border-blue-100 text-blue-700"
                        : "text-slate-600 hover:bg-white/70 border border-transparent"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-slate-400")}
                      style={{ minWidth: '20px' }}
                    />
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {isAppointments && (
                          <span className="text-slate-400">
                            {appointmentExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </span>
                        )}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto bg-blue-50 text-blue-700">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </button>

                  {isAppointments && isOpen && (
                    <div
                      className={cn(
                        "ml-2 rounded-xl bg-white/70 border border-blue-50 shadow-inner overflow-hidden",
                        "transition-[max-height,opacity] duration-300 ease-in-out",
                        appointmentExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="py-2">
                        {appointmentSubItems.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = appointmentActiveTab === subItem.id;
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => handleAppointmentSubItemClick(subItem.id)}
                              className={cn(
                                "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                                isSubActive
                                  ? "text-blue-700 bg-blue-50"
                                  : "text-slate-500 hover:text-slate-700 hover:bg-blue-50/60"
                              )}
                            >
                              <span className={cn(
                                "flex items-center justify-center h-5 w-5 rounded-full",
                                isSubActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                              )}>
                                <SubIcon className="h-3.5 w-3.5" />
                              </span>
                              <span className="flex-1 text-left">{subItem.label}</span>
                              {subItem.id === 'availability' && (
                                <span className="flex items-center gap-1 text-xs text-blue-600">
                                  <Circle className="h-2 w-2 fill-blue-600 text-blue-600" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="px-4 py-4 border-t border-slate-200/70 bg-white/70 backdrop-blur-sm space-y-3">
          <div className={cn("flex items-center", isOpen ? "justify-between" : "justify-center")}>
            {isOpen && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-2 text-slate-700 font-semibold bg-blue-50 hover:bg-blue-100 border border-blue-100"
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            )}
            <div className="[&_button]:border-slate-200 [&_button]:bg-white/80">
              <ThemeToggle />
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-red-500 font-semibold",
              "bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100",
              "border border-red-100 hover:border-red-200"
            )}
          >
            <LogOut className="h-4 w-4" />
            {isOpen && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {isMobile && !isOpen && (
        <Button
          variant="default"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 h-10 w-10 rounded-full shadow-lg bg-blue-600 text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default AdminSidebar;
