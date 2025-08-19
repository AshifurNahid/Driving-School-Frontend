import { Dispatch } from 'redux';
import api from '@/utils/axios';

// Action Types
export const SLOT_PRICING_LIST_REQUEST = 'SLOT_PRICING_LIST_REQUEST';
export const SLOT_PRICING_LIST_SUCCESS = 'SLOT_PRICING_LIST_SUCCESS';
export const SLOT_PRICING_LIST_FAIL = 'SLOT_PRICING_LIST_FAIL';

export const SLOT_PRICING_CREATE_REQUEST = 'SLOT_PRICING_CREATE_REQUEST';
export const SLOT_PRICING_CREATE_SUCCESS = 'SLOT_PRICING_CREATE_SUCCESS';
export const SLOT_PRICING_CREATE_FAIL = 'SLOT_PRICING_CREATE_FAIL';
export const SLOT_PRICING_CREATE_RESET = 'SLOT_PRICING_CREATE_RESET';

export const SLOT_PRICING_UPDATE_REQUEST = 'SLOT_PRICING_UPDATE_REQUEST';
export const SLOT_PRICING_UPDATE_SUCCESS = 'SLOT_PRICING_UPDATE_SUCCESS';
export const SLOT_PRICING_UPDATE_FAIL = 'SLOT_PRICING_UPDATE_FAIL';
export const SLOT_PRICING_UPDATE_RESET = 'SLOT_PRICING_UPDATE_RESET';

export const SLOT_PRICING_DELETE_REQUEST = 'SLOT_PRICING_DELETE_REQUEST';
export const SLOT_PRICING_DELETE_SUCCESS = 'SLOT_PRICING_DELETE_SUCCESS';
export const SLOT_PRICING_DELETE_FAIL = 'SLOT_PRICING_DELETE_FAIL';
export const SLOT_PRICING_DELETE_RESET = 'SLOT_PRICING_DELETE_RESET';

export const SLOT_PRICING_DETAILS_REQUEST = 'SLOT_PRICING_DETAILS_REQUEST';
export const SLOT_PRICING_DETAILS_SUCCESS = 'SLOT_PRICING_DETAILS_SUCCESS';
export const SLOT_PRICING_DETAILS_FAIL = 'SLOT_PRICING_DETAILS_FAIL';

// Interfaces
export interface SlotPricing {
  id: number;
  duration_hours: number;
  price_per_slot: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface SlotPricingCreatePayload {
  duration_hours: number;
  price_per_slot: number;
  status?: number;
}

export interface SlotPricingUpdatePayload {
  id: number;
  duration_hours: number;
  price_per_slot: number;
  status?: number;
}

// Action Creators

// Get slot pricing list
export const getSlotPricingList = (pageNumber: number = 1, pageSize: number = 10) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: SLOT_PRICING_LIST_REQUEST });

    const { data } = await api.get(`/slot-pricing?page_number=${pageNumber}&page_size=${pageSize}`);

    dispatch({
      type: SLOT_PRICING_LIST_SUCCESS,
      payload: data.data
    });
  } catch (error: any) {
    dispatch({
      type: SLOT_PRICING_LIST_FAIL,
      payload: error.response?.data?.status?.message || error.message
    });
  }
};

// Create slot pricing
export const createSlotPricing = (payload: SlotPricingCreatePayload) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: SLOT_PRICING_CREATE_REQUEST });

    const { data } = await api.post('/slot-pricing', payload);

    dispatch({
      type: SLOT_PRICING_CREATE_SUCCESS,
      payload: {
        data: data.data,
        message: data.status.message
      }
    });
  } catch (error: any) {
    dispatch({
      type: SLOT_PRICING_CREATE_FAIL,
      payload: error.response?.data?.status?.message || error.message
    });
  }
};

// Update slot pricing
export const updateSlotPricing = (id: number, payload: Omit<SlotPricingUpdatePayload, 'id'>) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: SLOT_PRICING_UPDATE_REQUEST });

    const { data } = await api.put(`/slot-pricing/${id}`, payload);

    dispatch({
      type: SLOT_PRICING_UPDATE_SUCCESS,
      payload: {
        data: data.data,
        message: data.status.message
      }
    });
  } catch (error: any) {
    dispatch({
      type: SLOT_PRICING_UPDATE_FAIL,
      payload: error.response?.data?.status?.message || error.message
    });
  }
};

// Delete slot pricing
export const deleteSlotPricing = (id: number) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: SLOT_PRICING_DELETE_REQUEST });

    await api.delete(`/slot-pricing/${id}`);

    dispatch({
      type: SLOT_PRICING_DELETE_SUCCESS,
      payload: { id, message: 'Slot pricing deleted successfully' }
    });
  } catch (error: any) {
    dispatch({
      type: SLOT_PRICING_DELETE_FAIL,
      payload: error.response?.data?.status?.message || error.message
    });
  }
};

// Get slot pricing details
export const getSlotPricingDetails = (id: number) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: SLOT_PRICING_DETAILS_REQUEST });

    const { data } = await api.get(`/slot-pricing/${id}`);

    dispatch({
      type: SLOT_PRICING_DETAILS_SUCCESS,
      payload: data.data
    });
  } catch (error: any) {
    dispatch({
      type: SLOT_PRICING_DETAILS_FAIL,
      payload: error.response?.data?.status?.message || error.message
    });
  }
};

// Reset actions
export const slotPricingCreateReset = () => ({ type: SLOT_PRICING_CREATE_RESET });
export const slotPricingUpdateReset = () => ({ type: SLOT_PRICING_UPDATE_RESET });
export const slotPricingDeleteReset = () => ({ type: SLOT_PRICING_DELETE_RESET });
