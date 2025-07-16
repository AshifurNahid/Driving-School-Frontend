import api from "@/utils/axios";
import {
  COURSE_LIST_REQUEST,
  COURSE_LIST_SUCCESS,
  COURSE_LIST_FAIL,
} from "../constants/courseConstants";

export const getCourses = (page = 1, pageSize = 10) => async (dispatch: any) => {
  try {
    dispatch({ type: COURSE_LIST_REQUEST });

    const response = await api.get(
      `/courses?PageNumber=${page}&PageSize=${pageSize}`
    );
    const data = response.data;

    const totalCourses = Number(response.headers['x-total-count']);
    const totalPages = Number(response.headers['x-total-pages']);
    const hasNextPage = response.headers['x-has-next-page'] === 'True';
    const hasPreviousPage = response.headers['x-has-previous-page'] === 'True';

    dispatch({
      type: COURSE_LIST_SUCCESS,
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
      type: COURSE_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};
