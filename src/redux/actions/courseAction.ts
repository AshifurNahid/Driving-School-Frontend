import api from "@/utils/axios";
import {
      GUEST_COURSE_LIST_REQUEST,
      GUEST_COURSE_LIST_SUCCESS,
      GUEST_COURSE_LIST_FAIL,
      GUEST_COURSE_DETAIL_REQUEST,
      GUEST_COURSE_DETAIL_SUCCESS,
      GUEST_COURSE_DETAIL_FAIL,
  } from "../constants/courseConstants";

export const getCourses = (page = 1, pageSize = 10) => async (dispatch: any) => {
  try {
    dispatch({ type: GUEST_COURSE_LIST_REQUEST });

    const response = await api.get(
      `/guest-courses?PageNumber=${page}&PageSize=${pageSize}`
    );
    const data = response.data;

    const totalCourses = Number(response.headers['x-total-count']);
    const totalPages = Number(response.headers['x-total-pages']);
    const hasNextPage = response.headers['x-has-next-page'] === 'True';
    const hasPreviousPage = response.headers['x-has-previous-page'] === 'True';

    dispatch({
      type: GUEST_COURSE_LIST_SUCCESS,
      payload: {
        courses: data.data,
        page,
        pageSize,
        totalCourses,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error: any) {
    dispatch({
      type: GUEST_COURSE_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};


export const getCourseDetail = (courseId: number) => async (dispatch: any) => {
  try {

    
    dispatch({ type: GUEST_COURSE_DETAIL_REQUEST });

    const response = await api.get(`/guest-courses/${courseId}`);
    const data = response.data.data;

    dispatch({
      type: GUEST_COURSE_DETAIL_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({ type: GUEST_COURSE_DETAIL_FAIL, payload: error.message });
  }
};