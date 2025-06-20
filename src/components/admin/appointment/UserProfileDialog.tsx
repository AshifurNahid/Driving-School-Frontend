
import React from 'react';
import { User, Mail, Calendar, BookOpen, MapPin, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail: string;
}

const UserProfileDialog = ({ open, onOpenChange, userName, userEmail }: UserProfileDialogProps) => {
  // Mock user data - in real app this would come from API
  const userProfile = {
    name: userName,
    email: userEmail,
    avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: '2024-01-15',
    enrolledCourses: 5,
    completedCourses: 3,
    totalAppointments: 8,
    upcomingAppointments: 2,
    status: 'Active',
    bio: 'Passionate learner interested in web development and data science. Currently pursuing advanced React patterns and machine learning fundamentals.',
    interests: ['Web Development', 'Data Science', 'UI/UX Design', 'Machine Learning']
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">User Profile</DialogTitle>
          <DialogDescription>
            Detailed information about the learner
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="text-lg">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                <Badge variant="outline" className="text-green-600 border-green-600 w-fit">
                  {userProfile.status}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{userProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {userProfile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-accent/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{userProfile.enrolledCourses}</div>
              <div className="text-sm text-muted-foreground">Enrolled Courses</div>
            </div>
            <div className="text-center p-3 bg-accent/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{userProfile.completedCourses}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-3 bg-accent/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{userProfile.totalAppointments}</div>
              <div className="text-sm text-muted-foreground">Total Appointments</div>
            </div>
            <div className="text-center p-3 bg-accent/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{userProfile.upcomingAppointments}</div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </div>
          </div>

          <Separator />

          {/* Bio */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              About
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {userProfile.bio}
            </p>
          </div>

          {/* Interests */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="font-semibold mb-2">Recent Activity</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
                <span>Completed "React Fundamentals" course</span>
                <span className="text-muted-foreground text-xs">2 days ago</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
                <span>Booked appointment for Dec 25</span>
                <span className="text-muted-foreground text-xs">1 week ago</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
                <span>Enrolled in "Advanced JavaScript"</span>
                <span className="text-muted-foreground text-xs">2 weeks ago</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
