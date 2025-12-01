import api from "@/utils/axios";
import { UserCourseResponse } from "@/types/userCourse";

export const fetchUserCourseById = async (
  userCourseId: string | number
): Promise<UserCourseResponse> => {
  if (!userCourseId) {
    throw new Error("Missing userCourseId");
  }

  const { data } = await api.get<UserCourseResponse>(
    `/user-courses/${userCourseId}`
  );

  return data;
};
