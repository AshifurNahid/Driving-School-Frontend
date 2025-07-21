// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Button } from "@/components/ui/button";
// import { Star } from "lucide-react";
// import {createCourseReview,updateCourseReview,deleteCourseReview } from "@/redux/actions/reviewAction";
// import { RootState } from "@/redux/store";

// export const CourseReviewSection = ({ courseId }: { courseId: number }) => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state: RootState) => state.adminUserDetails); // adjust as needed
//   const { reviews, loading } = useSelector((state: RootState) => state.course_reviews);

//   const [rating, setRating] = useState(0);
//   const [review, setReview] = useState("");
//   const [editing, setEditing] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);

//   // Fetch reviews on mount
// //   useEffect(() => {
// //     dispatch(fetchReviews(courseId) as any);
// //   }, [dispatch, courseId]);

//   // Find if user already posted a review
//   const userReview = reviews?.find((r: any) => r.user_id === user?.id);

//   useEffect(() => {
//     if (userReview) {
//       setRating(userReview.rating);
//       setReview(userReview.review);
//       setEditing(true);
//       setEditId(userReview.id);
//     } else {
//       setRating(0);
//       setReview("");
//       setEditing(false);
//       setEditId(null);
//     }
//   }, [userReview]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const requestBody={
//         course_id: courseId,
//         rating,
//         review,
//         is_verified_purchase: true,

//     }
//     if (editing && editId) {
//     //   dispatch(updateCourseReview(editId, { course_id: courseId, rating, review }) as any);
//     } else {
//       dispatch(createCourseReview(requestBody) as any);
//     }
//   };

//   const handleDelete = () => {
//     if (editId) {
//     //   dispatch(deleteReview(editId) as any);
//     }
//   };

//   return (
//     <div>
//       <h3 className="text-xl font-semibold mb-4">Reviews</h3>
//       {user ? (
//         <form onSubmit={handleSubmit} className="mb-6">
//           <div className="flex items-center mb-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <button
//                 type="button"
//                 key={star}
//                 onClick={() => setRating(star)}
//                 className={star <= rating ? "text-yellow-400" : "text-gray-300"}
//               >
//                 <Star className="h-6 w-6" fill={star <= rating ? "#facc15" : "none"} />
//               </button>
//             ))}
//           </div>
//           <textarea
//             className="w-full border rounded p-2 mb-2"
//             value={review}
//             onChange={(e) => setReview(e.target.value)}
//             placeholder="Write your review..."
//             required
//           />
//           <div className="flex gap-2">
//             <Button type="submit" disabled={loading}>
//               {editing ? "Update Review" : "Post Review"}
//             </Button>
//             {editing && (
//               <Button type="button" variant="outline" onClick={handleDelete} disabled={loading}>
//                 Delete Review
//               </Button>
//             )}
//           </div>
//         </form>
//       ) : (
//         <div className="mb-4 text-muted-foreground">Log in to post a review.</div>
//       )}

//       <div className="space-y-4">
//         {reviews?.length === 0 && <div>No reviews yet.</div>}
//         {reviews?.map((r: any) => (
//           <div key={r.id} className="border rounded p-3">
//             <div className="flex items-center gap-2 mb-1">
//               <span className="font-semibold">{r.user_name}</span>
//               <span className="flex">
//                 {[...Array(r.rating)].map((_, i) => (
//                   <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
//                 ))}
//               </span>
//             </div>
//             <div className="text-sm text-muted-foreground">{r.review}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };