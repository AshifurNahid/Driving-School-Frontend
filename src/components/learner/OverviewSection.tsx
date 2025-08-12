// components/learner/OverviewSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';
import UpcomingAppointmentsCard from './UpcomingAppointmentsCard';
import ProgressOverviewCard from './ProgressOverviewCard';

interface OverviewSectionProps {
  courses: any[];
  activeCourses: any[];
  completedCourses: any[];
  appointments: any[];
  appointmentsLoading: boolean;
  appointmentsError: string | null;
}

const OverviewSection = ({ 
  courses, 
  activeCourses, 
  completedCourses, 
  appointments,
  appointmentsLoading,
  appointmentsError 
}: OverviewSectionProps) => {
  return (
    <div className="space-y-6">
      <ProgressOverviewCard 
        totalCourses={courses.length}
        completedCourses={completedCourses.length}
        activeCourses={activeCourses.length}
      />
      
      <UpcomingAppointmentsCard 
        appointments={appointments}
        loading={appointmentsLoading}
        error={appointmentsError}
      />
    </div>
  );
};

export default OverviewSection;