import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import courseService from "../../services/course.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";

const STATUS_STYLE = {
  active: "bg-green-100 text-green-700",
  expired: "bg-amber-100 text-amber-700",
  revoked: "bg-red-100 text-red-700",
};

const thumbOf = (c) => c?.thumbnail?.[0]?.url || "https://placehold.co/600x400?text=Course";

export default function MyCoursesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await courseService.getMyCourses();
        if (mounted) setItems(res.data?.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load your courses");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif-elegant text-3xl text-slate-800 mb-6">My Courses</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-slate-100">
            <p className="text-slate-600 mb-4">You haven't enrolled in any courses yet.</p>
            <Link
              to="/courses"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md font-semibold"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => {
              const course = p.course || p;
              const status = p.status || "active";
              const id = course?._id || p.courseId;
              return (
                <div key={p._id || id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <img src={thumbOf(course)} alt={course?.title} className="w-full h-44 object-cover" />
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800 line-clamp-1">{course?.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${STATUS_STYLE[status] || ""}`}>
                        {status}
                      </span>
                    </div>
                    {status === "active" ? (
                      <Link
                        to={`/my-courses/${id}`}
                        className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
                      >
                        Continue Learning
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="block w-full text-center bg-slate-200 text-slate-500 font-semibold py-2 rounded cursor-not-allowed"
                      >
                        {status === "expired" ? "Expired" : "Revoked"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
