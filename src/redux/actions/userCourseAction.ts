import api from "@/utils/axios";
import {
  USER_COURSE_LIST_REQUEST,
  USER_COURSE_LIST_SUCCESS,
  USER_COURSE_LIST_FAIL,
} from "../constants/userCourseConstants";
import { UserCourseApiResponse } from "@/types/user";

export const getUserCourses = (userId: number, page = 1, pageSize = 10) => async (dispatch: any) => {
  try {
    dispatch({ type: USER_COURSE_LIST_REQUEST });
    const response = await api.get(`/user-courses?PageNumber=${page}&PageSize=${pageSize}&UserId=${userId}`);
    const data: UserCourseApiResponse = response.data;
    dispatch({
      type: USER_COURSE_LIST_SUCCESS,
      payload: {
        courses: data.data,
        page,
        pageSize,
        totalCourses: Number(response.headers['x-total-count']) || data.data.length,
        totalPages: Number(response.headers['x-total-pages']) || 1,
        hasNextPage: response.headers['x-has-next-page'] === 'True',
        hasPreviousPage: response.headers['x-has-previous-page'] === 'True',
      },
    });
  } catch (error: any) {
    dispatch({
      type: USER_COURSE_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
}; 