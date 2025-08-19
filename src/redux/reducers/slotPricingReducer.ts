import {
  SLOT_PRICING_LIST_REQUEST,
  SLOT_PRICING_LIST_SUCCESS,
  SLOT_PRICING_LIST_FAIL,
  SLOT_PRICING_CREATE_REQUEST,
  SLOT_PRICING_CREATE_SUCCESS,
  SLOT_PRICING_CREATE_FAIL,
  SLOT_PRICING_CREATE_RESET,
  SLOT_PRICING_UPDATE_REQUEST,
  SLOT_PRICING_UPDATE_SUCCESS,
  SLOT_PRICING_UPDATE_FAIL,
  SLOT_PRICING_UPDATE_RESET,
  SLOT_PRICING_DELETE_REQUEST,
  SLOT_PRICING_DELETE_SUCCESS,
  SLOT_PRICING_DELETE_FAIL,
  SLOT_PRICING_DELETE_RESET,
  SLOT_PRICING_DETAILS_REQUEST,
  SLOT_PRICING_DETAILS_SUCCESS,
  SLOT_PRICING_DETAILS_FAIL,
  SlotPricing
} from '../actions/slotPricingAction';

// List State
interface SlotPricingListState {
  loading: boolean;
  slotPricings: SlotPricing[];
  error: string | null;
}

const initialSlotPricingListState: SlotPricingListState = {
  loading: false,
  slotPricings: [],
  error: null
};

export const slotPricingListReducer = (
  state = initialSlotPricingListState,
  action: any
): SlotPricingListState => {
  switch (action.type) {
    case SLOT_PRICING_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case SLOT_PRICING_LIST_SUCCESS:
      return {
        loading: false,
        slotPricings: Array.isArray(action.payload) ? action.payload : [],
        error: null
      };
    case SLOT_PRICING_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Create State
interface SlotPricingCreateState {
  loading: boolean;
  success: boolean;
  slotPricing: SlotPricing | null;
  error: string | null;
  message: string | null;
}

const initialSlotPricingCreateState: SlotPricingCreateState = {
  loading: false,
  success: false,
  slotPricing: null,
  error: null,
  message: null
};

export const slotPricingCreateReducer = (
  state = initialSlotPricingCreateState,
  action: any
): SlotPricingCreateState => {
  switch (action.type) {
    case SLOT_PRICING_CREATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };
    case SLOT_PRICING_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        slotPricing: action.payload.data,
        message: action.payload.message,
        error: null
      };
    case SLOT_PRICING_CREATE_FAIL:
      return { 
        ...state, 
        loading: false, 
        success: false, 
        error: action.payload,
        message: null 
      };
    case SLOT_PRICING_CREATE_RESET:
      return initialSlotPricingCreateState;
    default:
      return state;
  }
};

// Update State
interface SlotPricingUpdateState {
  loading: boolean;
  success: boolean;
  slotPricing: SlotPricing | null;
  error: string | null;
  message: string | null;
}

const initialSlotPricingUpdateState: SlotPricingUpdateState = {
  loading: false,
  success: false,
  slotPricing: null,
  error: null,
  message: null
};

export const slotPricingUpdateReducer = (
  state = initialSlotPricingUpdateState,
  action: any
): SlotPricingUpdateState => {
  switch (action.type) {
    case SLOT_PRICING_UPDATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };
    case SLOT_PRICING_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        slotPricing: action.payload.data,
        message: action.payload.message,
        error: null
      };
    case SLOT_PRICING_UPDATE_FAIL:
      return { 
        ...state, 
        loading: false, 
        success: false, 
        error: action.payload,
        message: null 
      };
    case SLOT_PRICING_UPDATE_RESET:
      return initialSlotPricingUpdateState;
    default:
      return state;
  }
};

// Delete State
interface SlotPricingDeleteState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
}

const initialSlotPricingDeleteState: SlotPricingDeleteState = {
  loading: false,
  success: false,
  error: null,
  message: null
};

export const slotPricingDeleteReducer = (
  state = initialSlotPricingDeleteState,
  action: any
): SlotPricingDeleteState => {
  switch (action.type) {
    case SLOT_PRICING_DELETE_REQUEST:
      return { ...state, loading: true, error: null, success: false };
    case SLOT_PRICING_DELETE_SUCCESS:
      return {
        loading: false,
        success: true,
        message: action.payload.message,
        error: null
      };
    case SLOT_PRICING_DELETE_FAIL:
      return { 
        ...state, 
        loading: false, 
        success: false, 
        error: action.payload,
        message: null 
      };
    case SLOT_PRICING_DELETE_RESET:
      return initialSlotPricingDeleteState;
    default:
      return state;
  }
};

// Details State
interface SlotPricingDetailsState {
  loading: boolean;
  slotPricing: SlotPricing | null;
  error: string | null;
}

const initialSlotPricingDetailsState: SlotPricingDetailsState = {
  loading: false,
  slotPricing: null,
  error: null
};

export const slotPricingDetailsReducer = (
  state = initialSlotPricingDetailsState,
  action: any
): SlotPricingDetailsState => {
  switch (action.type) {
    case SLOT_PRICING_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case SLOT_PRICING_DETAILS_SUCCESS:
      return {
        loading: false,
        slotPricing: action.payload,
        error: null
      };
    case SLOT_PRICING_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
