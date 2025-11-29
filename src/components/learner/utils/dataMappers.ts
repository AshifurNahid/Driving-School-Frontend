import { UserAppointmentItem } from '@/types/appointment';

export const mapCoursesData = (courses: any[]) => {
  return courses.map((uc: any) => ({
    user_course: uc?.id, // The enrolled course ID (user_course ID) needed for the learn route
    id: uc.course?.id, // The course ID for the course detail page
    title: uc.course?.title,
    instructor: uc.course?.instructor || "Instructor",
    thumbnail: uc.course?.thumbnail_photo_path,
    progress: uc.progress_percentage,
    totalLessons: uc.course?.course_modules?.reduce((sum: number, m: any) => sum + (m.course_module_lessons?.length || 0), 0) || 0,
    completedLessons: Math.round((uc.progress_percentage / 100) * (
      uc.course?.course_modules?.reduce((sum: number, m: any) => sum + (m.course_module_lessons?.length || 0), 0) || 0
    )),
    lastAccessed: uc.updated_at,
    completed: uc.progress_percentage === 100,
  }));
};

export const mapAppointmentsData = (appointments: UserAppointmentItem[]) => {
  return appointments.map((appointment: UserAppointmentItem) => ({
    id: appointment.id,
    type: appointment.appointmentType || "Driving Lesson",
    instructor: `Instructor ${appointment.appointmentSlot?.instructorId || ""}`,
    date: appointment.appointmentSlot?.date || "",
    start_time: appointment.appointmentSlot?.startTime || "",
    end_time: appointment.appointmentSlot?.endTime || "",
    location: appointment.appointmentSlot?.location || "School Location",
    status: appointment.status.toLowerCase(),
    vehicle: "School Vehicle",
    notes: appointment.note || ""
  }));
};
