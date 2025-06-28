import api from "@/utils/axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from "../constants/authConstants";
import { User } from "@/types/user";

// Login Action
export const login = (email: string, password: string) => async (dispatch: any) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const { data } = await api.post("/login", { email, password });
    // Save tokens
    localStorage.setItem("access_token", data.data.access_token);
    localStorage.setItem("refresh_token", data.data.refresh_token);
    // Save user info
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.data.user as User });
    localStorage.setItem("userInfo", JSON.stringify(data.data.user));
  } catch (error: any) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Register Action
export const register = (
  full_name: string,
  email: string,
  password: string,
  phone: string
) => async (dispatch: any) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const { data } = await api.post("/register", {
      full_name,
      email,
      password,
      phone,
    });
    // Save tokens if returned (adjust if your register API returns tokens)
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data.data });
  } catch (error: any) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const logout = () => (dispatch: any) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  dispatch({ type: USER_LOGOUT });
};