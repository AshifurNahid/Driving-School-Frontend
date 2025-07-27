import api from "@/utils/axios";
import {
  INSTRUCTOR_CREATE_REQUEST,
  INSTRUCTOR_CREATE_SUCCESS,
  INSTRUCTOR_CREATE_FAIL,
  INSTRUCTOR_UPDATE_REQUEST,
  INSTRUCTOR_UPDATE_SUCCESS,
  INSTRUCTOR_UPDATE_FAIL,
  INSTRUCTOR_DELETE_REQUEST,
  INSTRUCTOR_DELETE_SUCCESS,
  INSTRUCTOR_DELETE_FAIL,
  INSTRUCTOR_LIST_REQUEST,
  INSTRUCTOR_LIST_SUCCESS,
  INSTRUCTOR_LIST_FAIL
} from "../constants/instructorConstants";
import { AppDispatch } from "../store";

export const createInstructor = (instructor) => async (dispatch: AppDispatch) => {
  try {
    dispatch({ type: INSTRUCTOR_CREATE_REQUEST });
    const { data } = await api.post(`/instructors`, instructor);
    dispatch({ type: INSTRUCTOR_CREATE_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: INSTRUCTOR_CREATE_FAIL, payload: error.message });
  }
};

export const updateInstructor = (instructor, id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch({ type: INSTRUCTOR_UPDATE_REQUEST });
    const { data } = await api.put(`/instructors/${id}`, instructor);
    dispatch({ type: INSTRUCTOR_UPDATE_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: INSTRUCTOR_UPDATE_FAIL, payload: error.message });
  }
};

export const deleteInstructor = (id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch({ type: INSTRUCTOR_DELETE_REQUEST });
    await api.delete(`/instructors/${id}`);
    dispatch({ type: INSTRUCTOR_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: INSTRUCTOR_DELETE_FAIL, payload: error.message });
  }
};

export const listInstructors = () => async (dispatch: AppDispatch) => {
  try {
    dispatch({ type: INSTRUCTOR_LIST_REQUEST });
    const { data } = await api.get(`/instructors`);
    dispatch({ type: INSTRUCTOR_LIST_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: INSTRUCTOR_LIST_FAIL, payload: error.message });
  }
};
