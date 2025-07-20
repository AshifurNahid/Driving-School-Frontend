import {
  GUEST_COURSE_LIST_REQUEST,
  GUEST_COURSE_LIST_SUCCESS,
  GUEST_COURSE_LIST_FAIL,
  GUEST_COURSE_DETAIL_REQUEST,
  GUEST_COURSE_DETAIL_SUCCESS,
  GUEST_COURSE_DETAIL_FAIL,
} from "../constants/courseConstants";
import { Course } from "@/types/courses";




interface CourseListState {
  loading: boolean;
  courses: Course[];
  course: Course | null;
  error: string | null;
  page: number;
  pageSize: number;
  totalCourses: number;
  totalPages: number;        // <-- Optional
  hasNextPage: boolean;      // <-- Optional
  hasPreviousPage: boolean;  // <-- Optional
}

const initialState: CourseListState = {
  loading: false,
  courses: [],
  course: null,

  error: null,
  page: 1,
  pageSize: 10,
  totalCourses: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false
};



export const courseListReducer = (
  state = initialState ,
  action: any
): CourseListState  => {
  switch (action.type) {
    case GUEST_COURSE_LIST_REQUEST:
    case GUEST_COURSE_DETAIL_REQUEST:
      return { ...state, loading: true, error: null };
    case GUEST_COURSE_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        course: action.payload,
        error: null
      };
    case GUEST_COURSE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        courses: action.payload.courses || action.payload, // fallback for old payloads
        page: action.payload.page ?? state.page,
        pageSize: action.payload.pageSize ?? state.pageSize,
        totalCourses: action.payload.totalCourses ?? state.totalCourses,
        totalPages: action.payload.totalPages,  // <-- optional but recommended
        hasNextPage: action.payload.hasNextPage, // <-- optional for navigation
        hasPreviousPage: action.payload.hasPreviousPage, // <-- optional
        error: null,
      };
    case GUEST_COURSE_LIST_FAIL:
    case GUEST_COURSE_DETAIL_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};