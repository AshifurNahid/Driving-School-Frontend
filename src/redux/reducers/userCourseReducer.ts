import {
  USER_COURSE_LIST_REQUEST,
  USER_COURSE_LIST_SUCCESS,
  USER_COURSE_LIST_FAIL,
  USER_COURSE_ADD,
  USER_COURSE_DETAILS_REQUEST,
  USER_COURSE_DETAILS_SUCCESS,
  USER_COURSE_DETAILS_FAIL,
} from "../constants/userCourseConstants";
import { EnrolledCourses } from "@/types/courses";

interface UserCourseListState {
  loading: boolean;
  courses: EnrolledCourses[];
  error: string | null;
  page: number;
  pageSize: number;
  totalCourses: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const initialState: UserCourseListState = {
  loading: false,
  courses: [],
  error: null,
  page: 1,
  pageSize: 10,
  totalCourses: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const userCourseListReducer = (
  state = initialState,
  action: any
): UserCourseListState => {
  switch (action.type) {
    case USER_COURSE_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_COURSE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        courses: action.payload.courses || action.payload,
        page: action.payload.page ?? state.page,
        pageSize: action.payload.pageSize ?? state.pageSize,
        totalCourses: action.payload.totalCourses ?? state.totalCourses,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPreviousPage: action.payload.hasPreviousPage,
        error: null,
      };
    case USER_COURSE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case USER_COURSE_ADD:
      // Check if course already exists in the list to avoid duplicates
      const courseExists = state.courses.some(
        (course) => course.course_id === action.payload.course_id || course.id === action.payload.id
      );
      if (courseExists) {
        return state; // Don't add duplicate
      }
      return {
        ...state,
        courses: [action.payload, ...state.courses],
        totalCourses: state.totalCourses + 1,
      };
    default:
      return state;
  }
}; 

export interface UserCourseDetailsState {
  loading: boolean;
  error: string | null;
  userCourse: EnrolledCourses | null;
}

const detailsInitialState: UserCourseDetailsState = {
  loading: false,
  error: null,
  userCourse: null,
};

export const userCourseDetailsReducer = (
  state = detailsInitialState,
  action: any
): UserCourseDetailsState => {
  switch (action.type) {
    case USER_COURSE_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_COURSE_DETAILS_SUCCESS:
      return { ...state, loading: false, userCourse: action.payload, error: null };
    case USER_COURSE_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload, userCourse: null };
    default:
      return state;
  }
};