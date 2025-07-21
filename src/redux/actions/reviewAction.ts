import api from "@/utils/axios";
import { COURSE_REVIEW_CREATE_FAIL, COURSE_REVIEW_CREATE_REQUEST, COURSE_REVIEW_CREATE_SUCCESS, COURSE_REVIEW_DELETE_FAIL, COURSE_REVIEW_DELETE_REQUEST, COURSE_REVIEW_DELETE_SUCCESS, COURSE_REVIEW_LIST_FAIL, COURSE_REVIEW_LIST_REQUEST, COURSE_REVIEW_LIST_SUCCESS, COURSE_REVIEW_UPDATE_FAIL, COURSE_REVIEW_UPDATE_REQUEST, COURSE_REVIEW_UPDATE_SUCCESS } from "../constants/reviewConstants";
import { AppDispatch } from "../store";
import { CourseReview } from "@/types/review";

export const createCourseReview = (courseReview) => async (dispatch: any) => {
    try {
        dispatch({ type: COURSE_REVIEW_CREATE_REQUEST });
        const { data } = await api.post(`/course-reviews`, courseReview);
        const apiReview=data.data;
        const review = {
            id: apiReview.id,
            course_id: apiReview.courseId,
            review_from_id: apiReview.reviewFromId,
            rating: apiReview.rating,
            review: apiReview.review,
            is_verified_purchase: apiReview.isVerifiedPurchase,
            status: apiReview.status,
    
            created_at: apiReview.createdAt,
            updated_at: apiReview.updatedAt,
          };
        dispatch({ type: COURSE_REVIEW_CREATE_SUCCESS, payload: review });
    } catch (error) {
        dispatch({ type: COURSE_REVIEW_CREATE_FAIL, payload: error.message });
    }
}

export const updateCourseReview = (courseReview,id:number) => async (dispatch: any) => {
    try {
        dispatch({ type: COURSE_REVIEW_UPDATE_REQUEST });
        const { data } = await api.put(`/course-reviews/${id}`, courseReview);
        const apiReview=data.data;
        const review = {
            id: apiReview.id,
            course_id: apiReview.courseId,
            review_from_id: apiReview.reviewFromId,
            rating: apiReview.rating,
            review: apiReview.review,
            is_verified_purchase: apiReview.isVerifiedPurchase,
            status: apiReview.status,
    
            created_at: apiReview.createdAt,
            updated_at: apiReview.updatedAt,
          };
        dispatch({ type: COURSE_REVIEW_UPDATE_SUCCESS, payload: review });
    } catch (error) {
        dispatch({ type: COURSE_REVIEW_UPDATE_FAIL, payload: error.message });
    }
}

export const deleteCourseReview = (id:number) => async (dispatch: any) => {
    try {
        dispatch({ type: COURSE_REVIEW_DELETE_REQUEST });
         await api.delete(`/course-reviews/${id}`);
        dispatch({ type: COURSE_REVIEW_DELETE_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: COURSE_REVIEW_DELETE_FAIL, payload: error.message });
    }
}

