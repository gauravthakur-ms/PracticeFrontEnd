import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import adminService from "../../services/admin.service";
import courseService from "../../services/course.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";
import ConfirmModal from "../../Components/shared/ConfirmModal";
import Pagination from "../../Components/shared/Pagination";

const PER_PAGE = 20;
const thumbOf = (c) => c?.thumbnail?.[0]?.url || "https://placehold.co/100x60";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCourses({ page, limit: PER_PAGE });
      setCourses(res.data?.data?.data || []);
      setTotal(res.data?.data?.total || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await courseService.deleteCourse(confirmId);
      toast.success("Course deleted");
      setConfirmId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <AdminLayout
      title="Courses"
      action={
        <Link
          to="/admin/courses/new"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
        >
          + New Course
        </Link>
      }
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Thumb</th>
                <th>Title</th>
                <th>By</th>
                <th>Price</th>
                <th>Rating</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((c) => (
                <tr key={c._id}>
                  <td className="p-3">
                    <img src={thumbOf(c)} alt="" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td>{c.title}</td>
                  <td>{c.createdBy?.userName || "-"}</td>
                  <td>₹{c.payableAmount ?? c.totalPrice}</td>
                  <td>{(c.averageRating || 0).toFixed(1)}</td>
                  <td className="text-right pr-4 space-x-2 whitespace-nowrap">
                    <Link to={`/admin/courses/${c._id}/edit`} className="text-orange-500 hover:underline">
                      Edit
                    </Link>
                    <Link
                      to={`/admin/courses/${c._id}/subjects`}
                      className="text-slate-700 hover:underline"
                      title="Manage subjects, lessons & video uploads"
                    >
                      Subjects &amp; Videos
                    </Link>
                    <button
                      onClick={() => setConfirmId(c._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    No courses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PER_PAGE))}
        onChange={setPage}
      />

      <ConfirmModal
        open={!!confirmId}
        title="Delete course?"
        message="This will permanently delete the course. This cannot be undone."
        destructive
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </AdminLayout>
  );
}
