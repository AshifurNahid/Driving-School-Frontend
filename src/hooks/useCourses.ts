import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourses } from "@/redux/actions/courseAction";
import { RootState } from "@/redux/store";

export const useCourses = (initialPage = 1, pageSize = 10) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { courses, loading, error } = useSelector((state: RootState) => state.guest_course);

  useEffect(() => {
    dispatch(getCourses(currentPage, pageSize) as any);
  }, [dispatch, currentPage, pageSize]);

  return { courses, loading, error, currentPage, setCurrentPage };
};