import api from "@/utils/axios";
import {
  ADMIN_USER_LIST_REQUEST,
  ADMIN_USER_LIST_SUCCESS,
  ADMIN_USER_LIST_FAIL,
} from "../constants/adminConstants";

// Get Users (Admin)
export const getAdminUsers = (pageNumber = 1, pageSize = 20) => async (dispatch: any) => {
  try {
    dispatch({ type: ADMIN_USER_LIST_REQUEST });
    const { data } = await api.get("/users", {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    dispatch({ type: ADMIN_USER_LIST_SUCCESS, payload: data.data });
  } catch (error: any) {
    dispatch({
      type: ADMIN_USER_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};