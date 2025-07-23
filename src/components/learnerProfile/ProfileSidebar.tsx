import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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

const ProfileSidebar = ({ userInfo, activeSection, setActiveSection, sidebarItems }: ProfileSidebarProps) => (
  <div className="w-64 bg-card border-r min-h-screen p-6">
    <div className="mb-8 text-center">
      <Avatar className="h-20 w-20 mx-auto mb-4">
        <AvatarImage src={userInfo?.user_detail?.image_path || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInfo?.full_name || "User")} alt={userInfo?.full_name || "User"} />
        <AvatarFallback className="text-lg">{(userInfo?.full_name || "User").split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <h2 className="font-bold text-foreground">{userInfo?.full_name || "User"}</h2>
      <p className="text-sm text-muted-foreground">{userInfo?.role?.title || "Learner"}</p>
      <p className="text-xs text-muted-foreground mt-1">ID: {userInfo?.id || "N/A"}</p>
    </div>
    <nav className="space-y-2">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === item.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </nav>
  </div>
);

export default ProfileSidebar; 