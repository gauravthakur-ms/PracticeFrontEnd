import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import adminService from "../../services/admin.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-100">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [u, c, o, r, ar] = await Promise.all([
          adminService.getUsers({ page: 1, limit: 1 }).catch(() => null),
          adminService.getCourses({ page: 1, limit: 1 }).catch(() => null),
          adminService.getOrders({ page: 1, limit: 5 }).catch(() => null),
          adminService.getReviews({ page: 1, limit: 1 }).catch(() => null),
          adminService.getAdminRequests({ page: 1, limit: 1 }).catch(() => null),
        ]);
        if (!mounted) return;
        setStats({
          users: u?.data?.data?.total ?? 0,
          courses: c?.data?.data?.total ?? 0,
          orders: o?.data?.data?.total ?? 0,
          reviews: r?.data?.data?.total ?? 0,
          requests: ar?.data?.data?.total ?? 0,
        });
        setRecentOrders(o?.data?.data?.data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Stat label="Users" value={stats.users} />
            <Stat label="Courses" value={stats.courses} />
            <Stat label="Orders" value={stats.orders} />
            <Stat label="Reviews" value={stats.reviews} />
            <Stat label="Requests" value={stats.requests} />
          </div>
          <section className="bg-white rounded-xl border border-slate-100 p-5">
            <h2 className="font-medium text-slate-800 mb-3">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-500">No orders yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="py-2">User</th>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td className="py-2">{o.createdBy?.userName || o.createdBy?.email || "-"}</td>
                      <td>{o.course?.title || "-"}</td>
                      <td>₹{o.amount ?? "-"}</td>
                      <td>{o.status || o.paymentStatus || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </AdminLayout>
  );
}
