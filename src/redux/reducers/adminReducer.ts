import {
  ADMIN_USER_LIST_REQUEST,
  ADMIN_USER_LIST_SUCCESS,
  ADMIN_USER_LIST_FAIL,
  ADMIN_USER_DETAILS_REQUEST,
  ADMIN_USER_DETAILS_SUCCESS,
  ADMIN_USER_DETAILS_FAIL,
  ADMIN_USER_DELETE_REQUEST,
  ADMIN_USER_DELETE_SUCCESS,
  ADMIN_USER_DELETE_FAIL,
  ROLE_UPDATE_REQUEST,
  ROLE_UPDATE_SUCCESS,
  ROLE_UPDATE_FAIL,
} from "../constants/adminConstants";
import { User, UserRole } from "@/types/user";

// User List State
interface AdminUserListState {
  loading: boolean;
  users: User[];
  error: string | null;
  page: number;
  pageSize: number;
  // totalUsers?: number;
}

const initialUserListState: AdminUserListState = {
  loading: false,
  users: [],
  error: null,
  page: 1,
  pageSize: 10,
  // totalUsers: 0,
};

export const adminUserListReducer = (
  state = initialUserListState,
  action: any
): AdminUserListState => {
  switch (action.type) {
    case ADMIN_USER_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case ADMIN_USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        // totalUsers: action.payload.totalUsers,
        error: null,
      };
    case ADMIN_USER_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ROLE_UPDATE_SUCCESS:
  return {
    ...state,
    users: state.users.map(user =>
      user.id === action.payload.id ? { ...user, ...action.payload } : user
    ),
  };
    default:
      return state;
  }
};

// User Details State
interface AdminUserDetailsState {
  loading: boolean;
  user: User | null;
  error: string | null;

}

const initialUserDetailsState: AdminUserDetailsState = {
  loading: false,
  user: null,
  error: null,
};

export const adminUserDetailsReducer = (
  state = initialUserDetailsState,
  action: any
): AdminUserDetailsState => {
  switch (action.type) {
    case ADMIN_USER_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case ADMIN_USER_DETAILS_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: null };
    case ADMIN_USER_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ROLE_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case ROLE_UPDATE_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: null };
    case ROLE_UPDATE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// User Delete State
interface AdminUserDeleteState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message?: string | null;
}

const initialUserDeleteState: AdminUserDeleteState = {
  loading: false,
  success: false,
  error: null,
  message: null,
};

export const adminUserDeleteReducer = (
  state = initialUserDeleteState,
  action: any
): AdminUserDeleteState => {
  switch (action.type) {
    case ADMIN_USER_DELETE_REQUEST:
      return { ...state, loading: true, success: false, error: null, message: null };
    case ADMIN_USER_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
        message: action.payload.message,
      };
    case ADMIN_USER_DELETE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload, message: null };
    default:
      return state;
  }
};


// Get Roles State
interface AdminRoleListState {
  loading: boolean;
  roles: UserRole[]; // Assuming roles are strings, adjust as necessary
  error: string | null;
}

const initialRoleListState: AdminRoleListState = {
  loading: false,
  roles: [],
  error: null,
};
export const adminRoleListReducer = (
  state = initialRoleListState,
  action: any
): AdminRoleListState => {
  switch (action.type) {
    case "ROLE_LIST_REQUEST":
      return { ...state, loading: true, error: null };
    case "ROLE_LIST_SUCCESS":
      return { ...state, loading: false, roles: action.payload, error: null };
    case "ROLE_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Update Role State
interface AdminRoleUpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
}