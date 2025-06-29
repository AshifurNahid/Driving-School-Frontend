import {
  ADMIN_USER_LIST_REQUEST,
  ADMIN_USER_LIST_SUCCESS,
  ADMIN_USER_LIST_FAIL,
} from "../constants/adminConstants";
import { User } from "@/types/user";

interface AdminUserListState {
  loading: boolean;
  users: User[];
  error: string | null;
}

const initialState: AdminUserListState = {
  loading: false,
  users: [],
  error: null,
};

export const adminUserListReducer = (
  state = initialState,
  action: any
): AdminUserListState => {
  switch (action.type) {
    case ADMIN_USER_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case ADMIN_USER_LIST_SUCCESS:
      return { ...state, loading: false, users: action.payload, error: null };
    case ADMIN_USER_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};