import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import adminService from "../../services/admin.service";
import reviewService from "../../services/review.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";
import StarRating from "../../Components/shared/StarRating";

const TABS = ["pending", "approved", "declined"];

export default function AdminReviewsPage() {
  const [tab, setTab] = useState("pending");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReviews({ page: 1, limit: 100 });
      const all = res.data?.data?.data || [];
      setReviews(all.filter((r) => (r.status || "pending") === tab));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const updateStatus = async (r, status) => {
    const courseId = r.course?._id || r.course;
    try {
      await reviewService.updateReviewStatus(courseId, r._id, { status });
      toast.success(`Review ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const removeReview = async (r) => {
    const courseId = r.course?._id || r.course;
    try {
      await reviewService.deleteReview(courseId, r._id);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <AdminLayout title="Reviews">
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-md capitalize ${
              tab === t ? "bg-orange-500 text-white" : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : reviews.length === 0 ? (
        <p className="text-center text-slate-500 py-10">No {tab} reviews.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {r.course?.title || "Course"}
                  </p>
                  <p className="font-medium text-slate-800">
                    {r.createdBy?.userName || r.createdBy?.email || "Anonymous"}
                  </p>
                </div>
                <StarRating value={r.rating || 0} size="text-xs" />
              </div>
              <p className="text-slate-600 text-sm mb-3">{r.review}</p>
              <div className="flex gap-2">
                {tab === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(r, "approved")}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(r, "declined")}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-3 py-1 rounded"
                    >
                      Decline
                    </button>
                  </>
                )}
                <button
                  onClick={() => removeReview(r)}
                  className="text-red-600 text-sm hover:underline ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
