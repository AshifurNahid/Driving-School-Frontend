import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourseDetail } from "@/redux/actions/courseAction";
import { RootState } from "@/redux/store";

export const useCourseDetails = (id: number) => {
  const dispatch = useDispatch();
  const { course, loading, error } = useSelector((state: RootState) => state.guest_course);


  useEffect(() => {
    if (!id || isNaN(id)) {
      return;
    }
    dispatch(getCourseDetail(Number(id)) as any);

  }, [dispatch, id]);

  return { course, loading, error };
};
