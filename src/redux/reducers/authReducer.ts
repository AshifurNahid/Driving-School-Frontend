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

interface AuthState {
  loading: boolean;
  userInfo: User | null;
  error?: string | null;
}

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo") as string)
  : null;

const initialState: AuthState = {
  loading: false,
  userInfo: userInfoFromStorage,
  error: null,
};

export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
    case USER_REGISTER_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, userInfo: action.payload, error: null };
    case USER_REGISTER_SUCCESS:
      return { ...state, loading: false, userInfo: null, error: null };
    case USER_LOGIN_FAIL:
    case USER_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case USER_LOGOUT:
      return { ...state, userInfo: null, error: null ,loading:false};
    default:
      return state;
  }
};