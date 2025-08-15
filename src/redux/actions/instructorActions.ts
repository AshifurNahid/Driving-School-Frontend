// redux/actions/instructorActions.ts

import api from '@/utils/axios';
import {
    INSTRUCTORS_REQUEST,
  INSTRUCTORS_SUCCESS,
  INSTRUCTORS_FAIL,
  INSTRUCTORS_RESET

} from '../constants/appointmentConstants';

const API_BASE_URL = 'http://localhost:5241';

// List all instructors
export const listInstructors = () => async (dispatch: any, getState: any) => {
  try {
    dispatch({ type: INSTRUCTORS_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await api.get(`${API_BASE_URL}/instructors`, config);

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