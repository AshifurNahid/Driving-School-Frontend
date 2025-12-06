// pages/DrivingSchoolLearnerProfile.tsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { getUserCourses } from "@/redux/actions/userCourseAction";
import { getUserAppointments } from "@/redux/actions/appointmentAction";
import { RootState } from "@/redux/store";
import ProfileSidebar from '@/components/learnerProfile/ProfileSidebar';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import { User, Calendar, BookOpen } from 'lucide-react';

// Import learner components
import OverviewSection from '@/components/learner/OverviewSection';
import AppointmentsSection from '@/components/learner/AppointmentsSection';
import CoursesSection from '@/components/learner/CoursesSection';
import ProfileHeader from '@/components/learner/ProfileHeader';
import { mapAppointmentsData, mapCoursesData } from '@/components/learner/utils/dataMappers';

const DrivingSchoolLearnerProfile = () => {
  const location = useLocation();
  const sectionFromState = (location.state as any)?.section;
  const [activeSection, setActiveSection] = useState(sectionFromState || 'overview');

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

  // Update active section when location state changes
  useEffect(() => {
    const sectionFromState = (location.state as any)?.section;
    if (sectionFromState) {
      setActiveSection(sectionFromState);
    }
  }, [location.state]);

  // Transform data using utility functions
  const mappedCourses = mapCoursesData(courses);
  const mappedAppointments = mapAppointmentsData(appointments);

  const activeCourses = mappedCourses.filter(course => !course?.completed);
  const completedCourses = mappedCourses.filter(course => course?.completed);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
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
      default:
        return <OverviewSection {...commonProps} />;
    }
  };

  return (
    <>
      <RoleBasedNavigation />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 mt-14 pt-4 relative">
        <ProfileSidebar
          userInfo={userInfo}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarItems={sidebarItems}
        />

        <div className="relative flex-1 px-4 sm:px-6 lg:px-10 py-8 lg:pl-[19rem] xl:pl-[21rem] transition-all duration-300">
          <div className="max-w-6xl mx-auto space-y-10">
            <ProfileHeader
              userInfo={userInfo}
              activeSection={activeSection}
              sidebarItems={sidebarItems}
            />
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default DrivingSchoolLearnerProfile;
