import {
  GUEST_COURSE_LIST_REQUEST,
  GUEST_COURSE_LIST_SUCCESS,
  GUEST_COURSE_LIST_FAIL,
  GUEST_COURSE_DETAIL_REQUEST,
  GUEST_COURSE_DETAIL_SUCCESS,
  GUEST_COURSE_DETAIL_FAIL,
  ENROLL_COURSE_REQUEST,
  ENROLL_COURSE_SUCCESS,
  ENROLL_COURSE_FAIL,
} from "../constants/courseConstants";
import { Course, EnrolledCourses } from "@/types/courses";
import { COURSE_REVIEW_CREATE_SUCCESS, COURSE_REVIEW_DELETE_SUCCESS, COURSE_REVIEW_UPDATE_SUCCESS } from "../constants/reviewConstants";




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
    case COURSE_REVIEW_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        course: { ...state.course, course_reviews: [...state.course?.course_reviews, action.payload] },
        error: null,
      };
      case COURSE_REVIEW_UPDATE_SUCCESS:
        return {
          ...state,
          loading: false,
          course: { ...state.course, course_reviews: state.course?.course_reviews.map((review: any) => review.id === action.payload.id ? action.payload : review) },
          error: null,
        };
    
      case COURSE_REVIEW_DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
          course: { ...state.course, course_reviews: state.course?.course_reviews.filter((review: any) => review.id !== action.payload) },
          error: null,
        };
      
    case GUEST_COURSE_LIST_FAIL:
    case GUEST_COURSE_DETAIL_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


interface EnrolledCoursesState {
  loading: boolean;
  enrolledCourses: EnrolledCourses[];
  error: string | null;
}

const initialEnrolledCoursesState: EnrolledCoursesState = {
  loading: false,
  enrolledCourses: [],
  error: null
};

export const enrolledCoursesReducer = (
  state = initialEnrolledCoursesState,
  action: any
): EnrolledCoursesState => {
  switch (action.type) {
    case ENROLL_COURSE_REQUEST:
      return { ...state, loading: true, error: null };
    case ENROLL_COURSE_SUCCESS:
      return { ...state, loading: false, enrolledCourses: [...state.enrolledCourses, action.payload], error: null };
    case ENROLL_COURSE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};