import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import adminService from "../../services/admin.service";
import courseService from "../../services/course.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";
import Pagination from "../../Components/shared/Pagination";

const PER_PAGE = 20;
const ROLE_STYLE = {
  user: "bg-slate-100 text-slate-700",
  course_admin: "bg-blue-100 text-blue-700",
  super_admin: "bg-orange-100 text-orange-700",
  customer_panel_admin: "bg-purple-100 text-purple-700",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [enrolledMap, setEnrolledMap] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ page, limit: PER_PAGE });
      setUsers(res.data?.data?.data || []);
      setTotal(res.data?.data?.total || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const toggleExpand = async (userId) => {
    if (expanded === userId) return setExpanded(null);
    setExpanded(userId);
    if (!enrolledMap[userId]) {
      try {
        const res = await courseService.getUserCourses(userId);
        setEnrolledMap((m) => ({ ...m, [userId]: res.data?.data || [] }));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load enrolled");
      }
    }
  };

  const revoke = async (userId, courseId) => {
    try {
      await courseService.updateCourseStatus(userId, courseId, { status: "revoked" });
      toast.success("Course revoked");
      const res = await courseService.getUserCourses(userId);
      setEnrolledMap((m) => ({ ...m, [userId]: res.data?.data || [] }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <AdminLayout title="Users">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Joined</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <>
                  <tr key={u._id}>
                    <td className="p-3">{u.userName || "-"}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`text-xs px-2 py-1 rounded ${ROLE_STYLE[u.role] || ""}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.isEmailVerified ? "✓" : "—"}</td>
                    <td className="text-xs text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleExpand(u._id)}
                        className="text-orange-500 text-sm hover:underline"
                      >
                        {expanded === u._id ? "Hide" : "Courses"}
                      </button>
                    </td>
                  </tr>
                  {expanded === u._id && (
                    <tr>
                      <td colSpan={6} className="bg-slate-50 px-6 py-4">
                        {!enrolledMap[u._id] ? (
                          <p className="text-sm text-slate-500">Loading...</p>
                        ) : enrolledMap[u._id].length === 0 ? (
                          <p className="text-sm text-slate-500">No enrolled courses.</p>
                        ) : (
                          <ul className="space-y-1">
                            {enrolledMap[u._id].map((p) => {
                              const cId = p.course?._id || p.course;
                              return (
                                <li
                                  key={p._id || cId}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span>
                                    {p.course?.title || cId} — {p.status || "active"}
                                  </span>
                                  {p.status !== "revoked" && (
                                    <button
                                      onClick={() => revoke(u._id, cId)}
                                      className="text-red-600 hover:underline text-xs"
                                    >
                                      Revoke
                                    </button>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    No users.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PER_PAGE))} onChange={setPage} />
    </AdminLayout>
  );
}
