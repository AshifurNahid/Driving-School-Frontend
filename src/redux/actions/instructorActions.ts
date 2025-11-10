// redux/actions/instructorActions.ts

import api from '@/utils/axios';
import {
    INSTRUCTORS_REQUEST,
  INSTRUCTORS_SUCCESS,
  INSTRUCTORS_FAIL,
  INSTRUCTORS_RESET

} from '../constants/appointmentConstants';

// List all instructors
export const listInstructors = () => async (dispatch: any, getState: any) => {
  try {
    dispatch({ type: INSTRUCTORS_REQUEST });

    const { data } = await api.get('/instructors');

    dispatch({
      type: INSTRUCTORS_SUCCESS,
      payload: data.data // Extract the data array from the response
    });
  } catch (error: any) {
    dispatch({
      type: INSTRUCTORS_FAIL,
      payload: error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message
    });
  }
};

// Reset instructors state
export const resetInstructors = () => (dispatch: any) => {
  dispatch({ type: INSTRUCTORS_RESET });
};