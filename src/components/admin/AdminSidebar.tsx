import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Settings,
  LogOut,
  Grid3X3
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

  const sidebarItems: SidebarItem[] = [
    { id: 'overview', label: 'Dashboard', icon: Grid3X3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'course-list', label: 'Courses', icon: BookOpen },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'instructors', label: 'Instructors', icon: UserCheck }
  ];

  const appointmentSubItems = [
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'requests', label: 'Requests', icon: FileText },
    { id: 'pricing', label: 'Pricing', icon: DollarSign }
  ];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
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

  const handleItemClick = (itemId: string) => {
    if (itemId === 'appointments') {
      setAppointmentExpanded(!appointmentExpanded);
      onTabChange(itemId);
    } else {
      setAppointmentExpanded(false);
      onTabChange(itemId);
    }
    // close only on mobile, not desktop (avoids width jump)
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

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black border-r border-gray-700/50 dark:border-gray-800/50 shadow-xl flex flex-col z-50 transition-[width] duration-300 md:relative md:translate-x-0",
          isOpen ? "w-80" : "md:w-16 w-0",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 dark:border-gray-800/50">
          {isOpen && (
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              EduPlatform
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0 hover:bg-gray-700/50 dark:hover:bg-gray-800/50 text-gray-300 hover:text-white"
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

        {/* Menu */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAppointments = item.id === 'appointments';
            return (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200",
                    "hover:bg-gray-700/50 dark:hover:bg-gray-800/50",
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 dark:text-blue-400 border border-blue-500/30 dark:border-blue-400/30 shadow-lg shadow-blue-500/10"
                      : "text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-blue-300 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
                    )}
                    style={{ minWidth: "20px" }}
                  />
                  {isOpen && (
                    <>
                      <span className="font-medium truncate flex-1">{item.label}</span>
                      {isAppointments && (
                        <div className="ml-auto transition-transform duration-200">
                          {appointmentExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      )}
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-5 px-1.5 text-xs bg-gray-100 dark:bg-gray-800"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {isAppointments && isOpen && (
                  <div
                    className={cn(
                      "ml-6 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
                      appointmentExpanded ? "max-h-32 opacity-100 mt-1" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="space-y-1 pb-1">
                      {appointmentSubItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = appointmentActiveTab === subItem.id;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => handleAppointmentSubItemClick(subItem.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors duration-200 text-sm",
                              "hover:bg-gray-700/30 dark:hover:bg-gray-800/30",
                              isSubActive
                                ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-200 dark:text-blue-300 border-l-2 border-blue-400"
                                : "text-gray-400 dark:text-gray-500 hover:text-gray-200 dark:hover:text-gray-300"
                            )}
                          >
                            <SubIcon
                              className={cn(
                                "h-4 w-4 shrink-0",
                                isSubActive
                                  ? "text-blue-300 dark:text-blue-400"
                                  : "text-gray-500 dark:text-gray-600"
                              )}
                              style={{ minWidth: "16px" }}
                            />
                            <span className="font-medium truncate">{subItem.label}</span>
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 dark:border-gray-800/50 flex-shrink-0">
          <div className={cn("flex items-center gap-3", isOpen ? "justify-between" : "justify-center")}>
            <div className="[&_button]:text-gray-200 [&_button]:hover:text-white [&_button]:hover:bg-gray-700/30 [&_button]:border-gray-600 [&_button]:hover:border-gray-500">
              <ThemeToggle />
            </div>
            {isOpen && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                <Link to="/admin">Go to Home</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {isMobile && !isOpen && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 md:hidden h-10 w-10 p-0 bg-white/95 dark:bg-gray-900/95 shadow-lg border-gray-300 dark:border-gray-600"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};

export default AdminSidebar;
