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
                <div className="space-y-1">
                  <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50 leading-tight">{sectionLabel}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                
                  
                </div>
              </div>
            </div>

          
          </div>

          <Separator className="border-slate-200 dark:border-slate-800" />

          
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;