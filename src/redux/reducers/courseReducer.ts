import {
  COURSE_LIST_REQUEST,
  COURSE_LIST_SUCCESS,
  COURSE_LIST_FAIL,
} from "../constants/courseConstants";
import { Course } from "@/types/courses";

interface CourseListState {
  loading: boolean;
  courses: Course[];
  error: string | null;
  page: number;
  pageSize: number;
  totalCourses: number;
}

const initialState: CourseListState = {
  loading: false,
  courses: [],
  error: null,
  page: 1,
  pageSize: 10,
  totalCourses: 0,
};

export const courseListReducer = (
  state = initialState,
  action: any
): CourseListState => {
  switch (action.type) {
    case COURSE_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case COURSE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        courses: action.payload.courses || action.payload, // fallback for old payloads
        page: action.payload.page ?? state.page,
        pageSize: action.payload.pageSize ?? state.pageSize,
        totalCourses: action.payload.totalCourses ?? state.totalCourses,
        error: null,
      };
    case COURSE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};