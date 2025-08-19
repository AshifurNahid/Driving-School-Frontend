import api from "@/utils/axios";
import {
  ADMIN_USER_LIST_REQUEST,
  ADMIN_USER_LIST_SUCCESS,
  ADMIN_USER_LIST_FAIL,
  ROLE_LIST_REQUEST,
  ROLE_LIST_SUCCESS,
  ROLE_LIST_FAIL,
} from "../constants/adminConstants";

// Get Users (Admin)
export const getAdminUsers = (page = 1, pageSize = 10) => async (dispatch: any) => {
  try {
    dispatch({ type: ADMIN_USER_LIST_REQUEST });
    const response = await api.get(`/users?PageNumber=${page}&PageSize=${pageSize}`);
    const data = response.data;

    const totalUsers = Number(response.headers['x-total-count']);
    const totalPages = Number(response.headers['x-total-pages']);
    const hasNextPage = response.headers['x-has-next-page'] === 'True';
    const hasPreviousPage = response.headers['x-has-previous-page'] === 'True';
    
    // You may need to get total count from headers or a separate API if your backend supports it
    dispatch({
      type: ADMIN_USER_LIST_SUCCESS,
      payload: {
        users: data.data,
        page,
        pageSize,
        totalUsers,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error: any) {
    dispatch({
      type: ADMIN_USER_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get User Details (Admin)
export const getAdminUserDetails = (userId: number|string) => async (dispatch: any) => {
  try {
    dispatch({ type: "ADMIN_USER_DETAILS_REQUEST" });
    const { data } = await api.get(`/users/${userId}`);
    dispatch({ type: "ADMIN_USER_DETAILS_SUCCESS", payload: data.data });
  } catch (error: any) {
    dispatch({
      type: "ADMIN_USER_DETAILS_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// delete User (Admin)
export const deleteAdminUser = (userId: number | string) => async (dispatch: any) => {
  try {
    dispatch({ type: "ADMIN_USER_DELETE_REQUEST" });
    const { data } = await api.delete(`/users/${userId}`);
    dispatch({
      type: "ADMIN_USER_DELETE_SUCCESS",
      payload: { userId, message: data.data || "User Successfully Deleted" },
    });
  } catch (error: any) {
    dispatch({
      type: "ADMIN_USER_DELETE_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get Roles (Admin)
export const getAdminRoles = () => async (dispatch: any) => {
  try {
    dispatch({ type: ROLE_LIST_REQUEST });
    const { data } = await api.get("/roles");
    dispatch({ type: ROLE_LIST_SUCCESS, payload: data.data });
  } catch (error: any) {
    dispatch({
      type: ROLE_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update Role (Admin)
export const updateAdminRole = (userID: number | string, roleID: number)=> async (dispatch: any) => {
  try {
    dispatch({ type: "ROLE_UPDATE_REQUEST" });
    const { data } = await api.put(`/users-role/${userID}`, { role_id: roleID });
    dispatch({ type: "ROLE_UPDATE_SUCCESS", payload: data.data });
  } catch (error: any) {
    dispatch({
      type: "ROLE_UPDATE_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};


// Create Course (Admin)
export const createAdminCourse = (courseData: any) => async (dispatch: any)=> {
  try {
    dispatch({ type: "ADMIN_COURSE_CREATE_REQUEST" });
    const { data } = await api.post("/courses", courseData);
    dispatch({ type: "ADMIN_COURSE_CREATE_SUCCESS", payload: data.data });
  } catch (error: any) {
    dispatch({
      type: "ADMIN_COURSE_CREATE_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
}

// Get Courses (Admin)
export const getAdminCourses = (page = 1, pageSize = 10) =>
  async (dispatch: any) => {
  try {
    dispatch({ type: "ADMIN_COURSE_LIST_REQUEST" });
    const response = await api.get(`/courses?PageNumber=${page}&PageSize=${pageSize}`);
    dispatch({
      type: "ADMIN_COURSE_LIST_SUCCESS",
      payload: {
        courses: response.data.data,
        totalCourses: response.data.data.length,
      },
    });
  } catch (error: any) {
    dispatch({
      type: "ADMIN_COURSE_LIST_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get Course Details (Admin)
export const getAdminCourseDetails = (courseId: number | string) => async (dispatch
: any) => {
  try {
    dispatch({ type: "ADMIN_COURSE_DETAILS_REQUEST" });
    const { data } = await api.get(`/courses/${courseId}`);
    dispatch({ type: "ADMIN_COURSE_DETAILS_SUCCESS", payload: data.data });
  } catch (error: any) {
    dispatch({
      type: "ADMIN_COURSE_DETAILS_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
}

// Update Course (Admin)
export const updateAdminCourse = (courseId: number | string, courseData: any)=> async (dispatch: any) => {
  try {
    dispatch({ type: "ADMIN_COURSE_UPDATE_REQUEST" });
    const { data } = await api.put(`/courses/${courseId}`, courseData);
    dispatch({ type: "ADMIN_COURSE_UPDATE_SUCCESS", payload: data.data });
  } catch (error: any) {
    dispatch({
      type: "ADMIN_COURSE_UPDATE_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
}

// Delete Course (Admin)
export const deleteAdminCourse = (courseId: number | string) => async (dispatch:
  any) => {
    try {
      dispatch({ type: "ADMIN_COURSE_DELETE_REQUEST" });
      const { data } = await api.delete(`/courses/${courseId}`);
      dispatch({
        type: "ADMIN_COURSE_DELETE_SUCCESS",
        payload: { courseId, message: data.data || "Course Successfully Deleted" },
      });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_COURSE_DELETE_FAIL",
        payload: error.response?.data?.message || error.message,
      });
    }
  }


  //Get Region List

  export const getAdminRegionList = () => async (dispatch: any, getState: any) => {
    const state = getState?.();
    const existing = state?.regionList?.regions;
    const isLoading = state?.regionList?.loading;

    // Skip fetching if regions are already cached or a fetch is in-flight
    if (isLoading || (Array.isArray(existing) && existing.length > 0)) {
      return;
    }

    try {
      dispatch({ type: "ADMIN_REGION_LIST_REQUEST" });
      const { data } = await api.get("/regions");
      dispatch({ type: "ADMIN_REGION_LIST_SUCCESS", payload: data.data });
    } catch (error: any) {
      dispatch({
        type: "ADMIN_REGION_LIST_FAIL",
        payload: error.response?.data?.message || error.message,
      });
    }
  }


