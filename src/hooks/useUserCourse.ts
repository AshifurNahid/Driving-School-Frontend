import { useQuery } from "@tanstack/react-query";
import { fetchUserCourseById } from "@/services/userCourses";
import { UserCourseResponse } from "@/types/userCourse";

export const USER_COURSE_QUERY_KEY = "user-course";

export const useUserCourse = (userCourseId?: string, userId?: number) => {
  return useQuery<UserCourseResponse, Error>({
    queryKey: [USER_COURSE_QUERY_KEY, userCourseId, userId],
    queryFn: async () => {
      if (!userCourseId) {
        throw new Error("Missing course id");
      }
      return fetchUserCourseById(userCourseId, userId);
    },
    enabled: Boolean(userCourseId),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
