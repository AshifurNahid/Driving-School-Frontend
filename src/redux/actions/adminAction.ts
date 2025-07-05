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
    const { data } = await api.get(`/users?PageNumber=${page}&PageSize=${pageSize}`);
    // You may need to get total count from headers or a separate API if your backend supports it
    dispatch({
      type: ADMIN_USER_LIST_SUCCESS,
      payload: {
        users: data.data,
        page,
        pageSize,
        // totalUsers: data.totalUsers, // If your backend provides this
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