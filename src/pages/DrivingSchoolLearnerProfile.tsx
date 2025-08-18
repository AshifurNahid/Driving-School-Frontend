// pages/DrivingSchoolLearnerProfile.tsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getUserCourses } from "@/redux/actions/userCourseAction";
import { getUserAppointments } from "@/redux/actions/appointmentAction";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import PublicHeader from '@/components/PublicHeader';
import ProfileSidebar from '@/components/learnerProfile/ProfileSidebar';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import { User, Calendar, BookOpen, Download, Award } from 'lucide-react';

// Import learner components
import OverviewSection from '@/components/learner/OverviewSection'; 
import AppointmentsSection from '@/components/learner/AppointmentsSection';
import CoursesSection from '@/components/learner/CoursesSection';
import MaterialsSection from '@/components/learner/MaterialsSection';
import AchievementsSection from '@/components/learner/AchievementsSection';
import ProfileHeader from '@/components/learner/ProfileHeader';
import { mapAppointmentsData, mapCoursesData } from '@/components/learner/utils/dataMappers';

const DrivingSchoolLearnerProfile = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Redux state
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const userId = userInfo?.id;
  const { courses, loading, error } = useSelector((state: RootState) => state.userCourseList);
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useSelector((state: RootState) => state.userAppointments);

  useEffect(() => {
    if (userId) {
      dispatch(getUserCourses(userId) as any);
      dispatch(getUserAppointments(userId) as any);
    }
  }, [dispatch, userId]);

  // Transform data using utility functions
  const mappedCourses = mapCoursesData(courses);
  const mappedAppointments = mapAppointmentsData(appointments);
  
  const activeCourses = mappedCourses.filter(course => !course?.completed);
  const completedCourses = mappedCourses.filter(course => course?.completed);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'materials', label: 'Materials', icon: Download },
    { id: 'achievements', label: 'Achievements', icon: Award },
  ];

  const renderContent = () => {
    const commonProps = {
      courses: mappedCourses,
      activeCourses,
      completedCourses,
      appointments: mappedAppointments,
      loading,
      error,
      appointmentsLoading,
      appointmentsError,
    };

    // For AppointmentsSection, use raw appointments data
    const appointmentProps = {
      ...commonProps,
      appointments: appointments || [], // Use raw appointments data from API
    };

    switch (activeSection) {
      case 'overview':
        return <OverviewSection {...commonProps} />;
      case 'appointments':
        return <AppointmentsSection {...appointmentProps} />;
      case 'courses':
        return <CoursesSection {...commonProps} />;
      case 'materials':
        return <MaterialsSection />;
      case 'achievements':
        return <AchievementsSection />;
      default:
        return null;
    }
  };

  return (
    <>
      <RoleBasedNavigation />
      <div className="min-h-screen bg-background mt-14">
        <div className="flex">
          <ProfileSidebar
            userInfo={userInfo}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sidebarItems={sidebarItems}
          />
          
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <ProfileHeader 
                userInfo={userInfo}
                activeSection={activeSection}
                sidebarItems={sidebarItems}
              />
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DrivingSchoolLearnerProfile;