import api from "@/utils/axios";
import {
  USER_COURSE_LIST_REQUEST,
  USER_COURSE_LIST_SUCCESS,
  USER_COURSE_LIST_FAIL,
  USER_COURSE_DETAILS_REQUEST,
  USER_COURSE_DETAILS_SUCCESS,
  USER_COURSE_DETAILS_FAIL,
} from "../constants/userCourseConstants";
import { EnrolledCourses } from "@/types/courses";

type EnrolledCoursesApiResponse = {
  status?: { code?: string | number; message?: string };
  data: EnrolledCourses[] | EnrolledCourses | null;
};

export const getUserCourses = (userId: number, page = 1, pageSize = 10) => async (dispatch: any) => {
  try {
    dispatch({ type: USER_COURSE_LIST_REQUEST });
    const response = await api.get(`/user-courses?PageNumber=${page}&PageSize=${pageSize}&UserId=${userId}`);
    const data: EnrolledCoursesApiResponse = response.data;
    dispatch({
      type: USER_COURSE_LIST_SUCCESS,
      payload: {
        courses: (data.data as EnrolledCourses[]) || [],
        page,
        pageSize,
        totalCourses: Number(response.headers['x-total-count']) || (Array.isArray(data.data) ? data.data.length : 0),
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


export const getUserCourseById = (id: number) => async (dispatch: any) => {
  try {
    dispatch({ type: USER_COURSE_DETAILS_REQUEST });
    const response = await api.get(`/user-courses/${id}`);
    const data: EnrolledCoursesApiResponse = response.data;
    const payload = (data?.data as EnrolledCourses) ?? (response.data as any);
    dispatch({ type: USER_COURSE_DETAILS_SUCCESS, payload });
  } catch (error: any) {
    dispatch({
      type: USER_COURSE_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};