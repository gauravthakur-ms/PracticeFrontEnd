import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const thumbUrl = (course) => {
  const t = course?.thumbnail;
  if (Array.isArray(t) && t[0]?.url) return t[0].url;
  if (typeof t === "string") return t;
  return "https://placehold.co/600x400?text=Course";
};

export default function CourseCard({ course }) {
  if (!course) return null;
  const hasDiscount = Number(course.discountPercent) > 0;
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={thumbUrl(course)}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            {course.discountPercent}% OFF
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-slate-800 line-clamp-2">{course.title}</h3>
        {course.label && (
          <p className="text-xs text-slate-500 uppercase tracking-wide">{course.label}</p>
        )}
        <StarRating value={course.averageRating || 0} size="text-xs" />
        <div className="flex items-baseline gap-2">
          <span className="text-orange-600 font-bold">
            ₹{course.payableAmount ?? course.totalPrice}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">₹{course.totalPrice}</span>
          )}
        </div>
        {course.createdBy?.userName && (
          <p className="text-xs text-slate-500">By {course.createdBy.userName}</p>
        )}
      </div>
    </Link>
  );
}
