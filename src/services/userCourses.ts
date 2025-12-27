import api from "@/utils/axios";
import { UserCourseApiResponse, UserCourseResponse } from "@/types/userCourse";
import { EnrollmentStatusPayload, EnrollmentStatusResponse } from "@/types/payment";

export const fetchUserCourseById = async (
  userCourseId: string | number
): Promise<UserCourseResponse> => {
  if (!userCourseId) {
    throw new Error("Missing userCourseId");
  }

  const { data } = await api.get<UserCourseApiResponse>(
    `/user-courses/${userCourseId}`
  );

  // API responds with { status, data }, we surface the enrollment payload only
  return data?.data || {};
};

export const fetchEnrollmentStatusByCourseId = async (
  courseId: string | number
): Promise<EnrollmentStatusPayload> => {
  if (!courseId) {
    throw new Error("Missing courseId");
  }

  const { data } = await api.get<EnrollmentStatusResponse>(
    `/user-courses/${courseId}/enrollment-status`
  );

  return data?.data || {};
};
