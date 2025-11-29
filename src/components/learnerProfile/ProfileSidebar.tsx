import { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Phone,
  Mail,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface ProfileSidebarProps {
  userInfo: any;
  activeSection: string;
  setActiveSection: (id: string) => void;
  sidebarItems: SidebarItem[];
}

const ProfileSidebar = ({ userInfo, activeSection, setActiveSection, sidebarItems }: ProfileSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const displayName = useMemo(() => {
    const name = [userInfo?.first_name, userInfo?.last_name].filter(Boolean).join(' ').trim();
    if (name) return name;
    return 'User';
  }, [userInfo?.first_name, userInfo?.last_name]);

  const initials = useMemo(() => {
    return displayName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const renderNavButton = (item: SidebarItem) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;

    const button = (
      <button
        onClick={() => setActiveSection(item.id)}
        className={cn(
          'group w-full relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
          isOpen ? 'px-3 py-2.5' : 'px-2.5 py-2.5 justify-center',
          isActive
            ? 'bg-slate-100/80 dark:bg-slate-900 border border-blue-500/30 text-slate-900 dark:text-slate-50'
            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900 border border-transparent'
        )}
      >
        <span
          className={cn(
            'absolute left-0 h-6 w-1 rounded-full',
            isActive ? 'bg-blue-500' : 'bg-transparent'
          )}
        />
        <span
          className={cn(
            'h-9 w-9 shrink-0 grid place-items-center rounded-lg border',
            isActive
              ? 'border-blue-500/40 bg-white text-blue-600 dark:border-blue-500/40 dark:bg-slate-800'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500'
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        {isOpen && <span className="flex-1 text-left">{item.label}</span>}
      </button>
    );

    if (isOpen) {
      return button;
    }

    return (
      <TooltipProvider delayDuration={0} key={item.id}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {!isOpen && isMobile && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed left-4 bottom-6 z-40 h-11 w-11 rounded-full shadow-lg"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <aside
        className={cn(
          'bg-white/95 dark:bg-slate-950/95 border-r border-slate-200/60 dark:border-slate-900 shadow-2xl',
          'backdrop-blur flex flex-col transition-all duration-300',
          'fixed inset-y-0 left-0 z-40 lg:static lg:h-auto lg:shadow-none',
          isOpen ? 'w-72 translate-x-0' : 'w-[84px]',
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200/60 dark:border-slate-900">
          <div className="flex items-center gap-3 min-h-[48px]">
            <Avatar className="h-11 w-11 rounded-2xl">
              <AvatarImage
                src={
                  userInfo?.user_detail?.image_path ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`
                }
                alt={displayName}
              />
              <AvatarFallback className="rounded-2xl text-base font-semibold">{initials}</AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="leading-tight">
                <p className="text-xs text-slate-500 dark:text-slate-400">Profile</p>
                <p className="text-lg font-semibold">{displayName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 dark:bg-blue-500/20">
                    {userInfo?.role?.title || 'Learner'}
                  </Badge>
                  <span className="text-[11px] text-slate-400">ID: {userInfo?.id ?? 'N/A'}</span>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              'ml-auto h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800',
              'bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            {isMobile ? (
              isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />
            ) : isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-4 pb-6 space-y-4">
          {isOpen && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                <span>{userInfo?.email || 'No email provided'}</span>
              </div>
              {userInfo?.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span>{userInfo.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Star className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-slate-500">Learning journey overview</span>
              </div>
            </div>
          )}

          <nav className="space-y-2">
            <div className={cn('px-3', !isOpen && 'hidden')}>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">Navigation</p>
            </div>
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <div key={item.id}>{renderNavButton(item)}</div>
              ))}
            </div>
          </nav>
        </div>

        {isOpen && (
          <div className="border-t border-slate-200/70 dark:border-slate-900 px-4 py-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Support: hello@drivingschool.com</span>
            </div>
            <p className="text-[11px]">Your progress is saved across devices.</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default ProfileSidebar;
