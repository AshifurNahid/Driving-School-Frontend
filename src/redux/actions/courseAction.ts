import api from "@/utils/axios";
import {
  COURSE_LIST_REQUEST,
  COURSE_LIST_SUCCESS,
  COURSE_LIST_FAIL,
} from "../constants/courseConstants";

// Fetch courses with pagination
export const getCourses = (page = 1, pageSize = 10) => async (dispatch: any) => {
  try {
    dispatch({ type: COURSE_LIST_REQUEST });
    const { data } = await api.get(
      `/courses?PageNumber=${page}&PageSize=${pageSize}`
    );
    dispatch({ type: COURSE_LIST_SUCCESS, payload: data.data });
  } catch (error: any) {
    dispatch({
      type: COURSE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};