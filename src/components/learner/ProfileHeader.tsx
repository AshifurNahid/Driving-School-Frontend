import { Badge } from '@/components/ui/badge';
import { Phone, Calendar } from 'lucide-react';

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

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {sidebarItems.find(item => item.id === activeSection)?.label}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              Joined -
            </div>
            <Badge variant="outline">{userInfo?.role?.title || "Learner"}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;