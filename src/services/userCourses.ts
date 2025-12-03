import api from "@/utils/axios";
import { UserCourseApiResponse, UserCourseResponse } from "@/types/userCourse";

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
