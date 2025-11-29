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
  Circle,
  Settings,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
          "fixed left-0 top-0 h-screen text-slate-900 dark:text-slate-100",
          "bg-white/95 dark:bg-slate-950/95 border-r border-slate-200/60 dark:border-slate-900 shadow-2xl",
          "backdrop-blur flex flex-col z-50 transition-all duration-300 lg:static",
          isOpen ? "w-72 translate-x-0" : "w-[84px]",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
          className
        )}
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200/60 dark:border-slate-900">
          <div className="flex items-center gap-3 min-h-[48px]">
            <div className="h-11 w-11 rounded-2xl grid place-items-center bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
              <Settings className="h-5 w-5" />
            </div>
            {isOpen && (
              <div className="leading-tight">
                <p className="text-xs text-slate-500 dark:text-slate-400">Admin management</p>
                <p className="text-lg font-semibold">Dashboard</p>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "ml-auto h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800",
              "bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
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

        <div className="flex-1 overflow-y-auto px-3 pt-4 pb-6 space-y-5">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 grid place-items-center font-semibold">
              NL
            </div>
            {isOpen && (
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Quick view</p>
                <p className="text-base font-semibold">Admin Panel</p>
              </div>
            )}
          </div>

          <nav className="space-y-4">
            {isOpen && (
              <div className="px-3">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">General</p>
              </div>
            )}
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isAppointments = item.id === 'appointments';

                const button = (
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      "group w-full relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                      collapsed ? "justify-center px-2.5 py-2.5" : "px-3 py-2.5",
                      isActive
                        ? "bg-slate-100/80 dark:bg-slate-900 border border-blue-500/30 text-slate-900 dark:text-slate-50"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900 border border-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 h-6 w-1 rounded-full",
                        isActive ? "bg-blue-500" : "bg-transparent"
                      )}
                    />
                    <span
                      className={cn(
                        "h-9 w-9 shrink-0 grid place-items-center rounded-lg border",
                        isActive
                          ? "border-blue-500/40 bg-white text-blue-600 dark:border-blue-500/40 dark:bg-slate-800"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {isAppointments && (
                          <span className="text-slate-400 dark:text-slate-500">
                            {appointmentExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </span>
                        )}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto bg-blue-500/10 text-blue-600 dark:text-blue-300 dark:bg-blue-500/20">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </button>
                );

                return (
                  <div key={item.id} className="space-y-2">
                    {collapsed ? (
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>{button}</TooltipTrigger>
                          <TooltipContent side="right" className="text-sm">
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      button
                    )}

                    {isAppointments && isOpen && (
                      <div
                        className={cn(
                          "ml-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 overflow-hidden",
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
                                    ? "text-blue-700 dark:text-blue-200 bg-white dark:bg-slate-800"
                                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex items-center justify-center h-5 w-5 rounded-full",
                                    isSubActive ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                  )}
                                >
                                  <SubIcon className="h-3.5 w-3.5" />
                                </span>
                                <span className="flex-1 text-left">{subItem.label}</span>
                                {subItem.id === 'availability' && (
                                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                    <Circle className="h-2 w-2 fill-green-500 text-green-500" />
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
            </div>
          </nav>
        </div>

        <div className="px-4 py-4 border-t border-slate-200/60 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800">
              <Layers className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@example.com</p>
              </div>
            )}
            <div className={cn("ml-auto flex items-center gap-2", collapsed && "mx-auto")}> 
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                asChild
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-red-500 font-semibold",
              "bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50",
              "border border-red-100 dark:border-red-900/40"
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
