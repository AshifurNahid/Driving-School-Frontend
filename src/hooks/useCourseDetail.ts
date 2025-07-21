import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourseDetail } from "@/redux/actions/courseAction";
import { RootState } from "@/redux/store";

export const useCourseDetails = (id: number) => {
  const dispatch = useDispatch();
  const { course, loading, error } = useSelector((state: RootState) => state.guest_course);

  console.log("🧩 useCourseDetails called with id:", id);

  useEffect(() => {
    console.log("🔁 useEffect running with id:", id);
    if (!id || isNaN(id)) {
      console.log("⚠️ Invalid id detected inside useEffect:", id);
      return;
    }
    dispatch(getCourseDetail(Number(id)) as any);

  }, [dispatch, id]);

  return { course, loading, error };
};
