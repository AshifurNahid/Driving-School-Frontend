import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Calendar, Shield } from 'lucide-react';

interface ProfileHeaderProps {
  userInfo: any;
  activeSection: string;
  sidebarItems: any[];
}

const ProfileHeader = ({ userInfo, activeSection, sidebarItems }: ProfileHeaderProps) => {
  // Only show header for sections that need it (not appointments)
  if (activeSection === 'appointments') {
    return null; // AppointmentsSection has its own header
  }

  const displayName = [userInfo?.first_name, userInfo?.last_name].filter(Boolean).join(' ').trim() || 'User';
  const sectionLabel = sidebarItems.find(item => item.id === activeSection)?.label;
  const initials = displayName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mb-4 lg:mb-2">
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 shadow-xl">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <Avatar className="h-14 w-14 rounded-2xl border border-slate-200 dark:border-slate-800">
                <AvatarImage
                  src={
                    userInfo?.user_detail?.image_path ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`
                  }
                  alt={displayName}
                />
                <AvatarFallback className="rounded-2xl text-base font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Profile Overview</p>
                <div className="space-y-1">
                  <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50 leading-tight">{sectionLabel}</h1>
                  <p className="text-sm text-muted-foreground">{displayName}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-500/50 dark:text-blue-200">
                    {userInfo?.role?.title || 'Learner'}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Active learner account
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-[260px]">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Contact</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span>{userInfo?.email || 'No email provided'}</span>
                  </div>
                  {userInfo?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <span>{userInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Status</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Enrolled learner</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Keep progressing to unlock achievements.</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="border-slate-200 dark:border-slate-800" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>Overview keeps your current journey visible.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Appointments, courses, materials and achievements are one tap away.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Responsive layout keeps everything aligned on any device.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;