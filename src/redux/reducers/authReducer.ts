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
} from "../constants/authConstants";
import { User } from "@/types/user";

interface AuthState {
  loading: boolean;
  userInfo: User | null;
  error?: string | null;
  successMessage?: string | null;
}

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo") as string)
  : null;

const initialState: AuthState = {
  loading: false,
  userInfo: userInfoFromStorage,
  error: null,
  successMessage: null,
};

export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
    case USER_REGISTER_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case VERIFY_OTP_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null, successMessage: null };
    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, userInfo: action.payload, error: null };
    case USER_REGISTER_SUCCESS:
    case FORGOT_PASSWORD_SUCCESS:
    case VERIFY_OTP_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
      return { ...state, loading: false, userInfo: null, error: null, successMessage: action.payload };
    case USER_LOGIN_FAIL:
    case USER_REGISTER_FAIL:
    case FORGOT_PASSWORD_FAIL:
    case VERIFY_OTP_FAIL:
    case RESET_PASSWORD_FAIL:
      return { ...state, loading: false, error: action.payload, successMessage: null };
    case USER_LOGOUT:
      return { ...state, userInfo: null, error: null ,loading:false};
    default:
      return state;
  }
};