import { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Mail, Menu, Phone, Settings, ChevronLeft, ChevronRight, User } from 'lucide-react';

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
    const firstName = userInfo?.first_name?.trim() || '';
    const lastName = userInfo?.last_name?.trim() || '';
    const combined = `${firstName} ${lastName}`.trim();
    return combined || userInfo?.full_name || userInfo?.email || 'User';
  }, [userInfo]);

  const avatarUrl = useMemo(() => {
    if (userInfo?.user_detail?.image_path) {
      return userInfo.user_detail.image_path;
    }
    return "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName);
  }, [displayName, userInfo]);

  const initials = useMemo(() => {
    return displayName
      .split(' ')
      .filter(Boolean)
      .map((name) => name[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  useEffect(() => {
    const updateDevice = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      }
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  const collapsed = !isOpen;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "bg-white/95 border border-slate-200/70 shadow-2xl backdrop-blur dark:bg-slate-950/95 dark:border-slate-900",
          "flex flex-col transition-all duration-300 text-slate-900 dark:text-slate-50 z-40",
          isMobile ? "fixed left-0 top-0 h-screen" : "relative min-h-[calc(100vh-7rem)] lg:sticky lg:top-16",
          isOpen ? "w-72" : "w-[84px]",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200/60 dark:border-slate-900">
          <div className="flex items-center gap-3 min-h-[48px]">
            <div className="h-11 w-11 rounded-2xl grid place-items-center bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
              <Settings className="h-5 w-5" />
            </div>
            {isOpen && (
              <div className="leading-tight">
                <p className="text-xs text-slate-500 dark:text-slate-400">Learner profile</p>
                <p className="text-lg font-semibold truncate">{displayName}</p>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "ml-auto h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800",
              "bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            {isMobile ? (
              <Menu className="h-4 w-4" />
            ) : isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-4 pb-6 space-y-5">
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="text-base font-semibold">{initials || 'U'}</AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{displayName}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">{userInfo?.role?.title || 'Learner'}</Badge>
                  {userInfo?.status === 0 ? (
                    <span className="text-amber-600">Pending</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <nav className="space-y-3">
            {isOpen && (
              <div className="px-3">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">Navigation</p>
              </div>
            )}
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (isMobile) {
                        setIsOpen(false);
                      }
                    }}
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
                    {isOpen && <span className="flex-1 text-left">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </nav>

          {isOpen && (
            <div className="space-y-3 px-2">
              <Separator />
              {userInfo?.email && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="truncate">{userInfo.email}</span>
                </div>
              )}
              {userInfo?.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-200">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="truncate">{userInfo.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-4 border-t border-slate-200/60 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800">
              <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{displayName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userInfo?.email || 'Profile'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {isMobile && !isOpen && (
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="fixed top-20 left-4 z-40 h-11 w-11 rounded-full shadow-lg bg-blue-600 text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default ProfileSidebar;