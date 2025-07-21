// import { COURSE_REVIEW_CREATE_FAIL, COURSE_REVIEW_CREATE_REQUEST, COURSE_REVIEW_CREATE_SUCCESS, COURSE_REVIEW_DELETE_FAIL, COURSE_REVIEW_DELETE_REQUEST, COURSE_REVIEW_DELETE_SUCCESS, COURSE_REVIEW_LIST_FAIL, COURSE_REVIEW_LIST_REQUEST, COURSE_REVIEW_LIST_SUCCESS, COURSE_REVIEW_UPDATE_FAIL, COURSE_REVIEW_UPDATE_REQUEST, COURSE_REVIEW_UPDATE_SUCCESS } from "../constants/reviewConstants";


// const initialState = {
//     reviews: [],
//     loading: false,
//     error: null,
//     status: "",
// }

// export const  reviewReducer = (state = initialState, action: any) => {
//     switch (action.type) {
//         case COURSE_REVIEW_CREATE_REQUEST:
//             return { ...state, loading: true };
//         case COURSE_REVIEW_CREATE_SUCCESS:
//             return { ...state, loading: false, reviews: [...state.reviews, action.payload],status: "successfully added" };
//         case COURSE_REVIEW_CREATE_FAIL:
//             return { ...state, loading: false, error: action.payload };
//         case COURSE_REVIEW_UPDATE_REQUEST:
//             return { ...state, loading: true };
//         case COURSE_REVIEW_UPDATE_SUCCESS:
//             return { ...state, loading: false, reviews: state.reviews.map(review => review.id === action.payload.id ? action.payload : review) };
//         case COURSE_REVIEW_UPDATE_FAIL:
//             return { ...state, loading: false, error: action.payload };
//         case COURSE_REVIEW_DELETE_REQUEST:
//             return { ...state, loading: true };
//         case COURSE_REVIEW_DELETE_SUCCESS:
//             return { ...state, loading: false, reviews: state.reviews.filter(review => review.id !== action.payload) };
//         case COURSE_REVIEW_DELETE_FAIL:
//             return { ...state, loading: false, error: action.payload };
//         default:
//             return state;
//     }
// }

