import api from "@/utils/axios";
import { UserCourseApiResponse, UserCourseResponse } from "@/types/userCourse";

const mapApiResponse = (payload?: UserCourseApiResponse): UserCourseResponse | null => {
  if (!payload) return null;
  if (payload.data && !Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data)) return payload.data[0] as UserCourseResponse;
  return null;
};

export const fetchUserCourseById = async (
  userCourseId: string | number,
  userId?: number
): Promise<UserCourseResponse> => {
  if (!userCourseId) {
    throw new Error("Missing userCourseId");
  }

  // Primary attempt: treat the param as the enrollment ID (API default)
  const primary = await api
    .get<UserCourseApiResponse>(`/user-courses/${userCourseId}`)
    .then(({ data }) => mapApiResponse(data))
    .catch(() => null);

  if (primary?.course) return primary;

  // Fallback: some flows pass the courseId instead of the enrollment id.
  // Try fetching the user's enrollments filtered by courseId to locate the correct record.
  if (userId) {
    const fallback = await api
      .get<UserCourseApiResponse>("/user-courses", {
        params: { UserId: userId, CourseId: userCourseId, PageSize: 1 },
      })
      .then(({ data }) => mapApiResponse(data))
      .catch(() => null);

    if (fallback?.course) return fallback;
  }

  throw new Error("Enrollment not found for this course");
};
