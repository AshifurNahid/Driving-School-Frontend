import api from "@/utils/axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  OTP_TIMER_START,
  OTP_TIMER_TICK,
  OTP_TIMER_EXPIRE,
} from "../constants/authConstants";
import { User } from "@/types/user";
import { getUserCourses } from "./userCourseAction";

// Login Action
export const login = (email: string, password: string) => async (dispatch: any) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const { data } = await api.post("/login", { email, password });
    // Save tokens
    localStorage.setItem("access_token", data.data.access_token);
    localStorage.setItem("refresh_token", data.data.refresh_token);
    // Save user info
    const user = data.data.user as User;
    // Dispatch user payload as before; also include success message if you want to store it
    dispatch({ type: USER_LOGIN_SUCCESS, payload: user });
    localStorage.setItem("userInfo", JSON.stringify(user));
    
    // Fetch user courses after successful login
    if (user?.id) {
      dispatch(getUserCourses(user.id) as any);
    }
  } catch (error: any) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.status?.message || error.response?.data?.message || error.message,
    });
  }
};

// Register Action

export interface RegistrationPayload {
  region_id: string | number;
  first_name: string;
  last_name: string;
  birth_date: { year: number; month: number; day: number };
  address: {
    street_address: string;
    street_address2?: string;
    city: string;
    state: string;
    postal: string;
  };
  student_email: string;
  parent_email?: string;
  student_phone: string;
  parent_phone?: string;
  learners_permit_issue_date: { year: number; month: number; day: number };
  has_license_from_another_country: string;
  driving_experience: string;
  course_id?: string | number;
  password: string;
  agreements: {
    paid_policy: boolean;
    completion_policy: boolean;
    instructor_ready_policy: boolean;
    refund_policy: boolean;
  };
}

export const register = (payload: RegistrationPayload) => async (dispatch: any) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const { data } = await api.post("/register", payload);
    // Success: use status.message from response
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data.status?.message || 'Registration successful' });
  } catch (error: any) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.status?.message || error.response?.data?.message || error.message,
    });
  }
};

export const logout = () => (dispatch: any) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  dispatch({ type: USER_LOGOUT });
};

// Forgot Password Action
export const forgotPassword = (email: string) => async (dispatch: any) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    const { data } = await api.put("/forget-password", { email });
    dispatch({ 
      type: FORGOT_PASSWORD_SUCCESS, 
      payload: data.status?.message || 'Password reset code sent to your email' 
    });
    // Start OTP timer (2 minutes = 120 seconds)
    dispatch({ type: OTP_TIMER_START, payload: 120 });
    return data;
  } catch (error: any) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response?.data?.status?.message || error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Timer Actions
export const startOTPTimer = (seconds: number) => (dispatch: any) => {
  dispatch({ type: OTP_TIMER_START, payload: seconds });
};

export const tickOTPTimer = () => (dispatch: any, getState: any) => {
  const { otpTimer } = getState().auth;
  if (otpTimer > 0) {
    dispatch({ type: OTP_TIMER_TICK, payload: otpTimer - 1 });
  } else {
    dispatch({ type: OTP_TIMER_EXPIRE });
  }
};

export const expireOTPTimer = () => (dispatch: any) => {
  dispatch({ type: OTP_TIMER_EXPIRE });
};

// Verify OTP Action
export const verifyOTP = (email: string, otp: string) => async (dispatch: any) => {
  try {
    dispatch({ type: VERIFY_OTP_REQUEST });
    const { data } = await api.post("/verify-otp", { email, otp });
    dispatch({ 
      type: VERIFY_OTP_SUCCESS, 
      payload: data.status?.message || 'OTP verified successfully' 
    });
    return data;
  } catch (error: any) {
    dispatch({
      type: VERIFY_OTP_FAIL,
      payload: error.response?.data?.status?.message || error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Reset Password Action
export const resetPassword = (email: string, otp: string, newPassword: string) => async (dispatch: any) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    const { data } = await api.put("/reset-password", { email, otp, new_password: newPassword });
    dispatch({ 
      type: RESET_PASSWORD_SUCCESS, 
      payload: data.status?.message || 'Password reset successfully' 
    });
    return data;
  } catch (error: any) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response?.data?.status?.message || error.response?.data?.message || error.message,
    });
    throw error;
  }
};


