// redux/reducers/instructorReducers.ts

import {
  INSTRUCTORS_REQUEST,
  INSTRUCTORS_SUCCESS,
  INSTRUCTORS_FAIL,
  INSTRUCTORS_RESET
} from '../constants/appointmentConstants';

// Instructor interface
export interface Instructor {
  id: number;
  instructor_name: string;
  description: string;
}

// Instructors list reducer
export const instructorListReducer = (
  state = { loading: false, instructors: [] as Instructor[], error: null },
  action: any
) => {
  switch (action.type) {
    case INSTRUCTORS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case INSTRUCTORS_SUCCESS:
      return {
        ...state,
        loading: false,
        instructors: action.payload || [],
        error: null
      };
    
    case INSTRUCTORS_FAIL:
      return {
        ...state,
        loading: false,
        instructors: [],
        error: action.payload
      };
    
    case INSTRUCTORS_RESET:
      return {
        loading: false,
        instructors: [],
        error: null
      };
    
    default:
      return state;
  }
};