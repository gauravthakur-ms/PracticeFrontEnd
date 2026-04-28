import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import adminService from "../../services/admin.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";
import Pagination from "../../Components/shared/Pagination";

const PER_PAGE = 20;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await adminService.getOrders({ page, limit: PER_PAGE });
        if (!mounted) return;
        const list = res.data?.data?.data || [];
        setOrders(statusFilter ? list.filter((o) => (o.status || o.paymentStatus) === statusFilter) : list);
        setTotal(res.data?.data?.total || 0);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [page, statusFilter]);

  return (
    <AdminLayout
      title="Orders"
      action={
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
        </select>
      }
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Order ID</th>
                <th>User</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="p-3 font-mono text-xs">{o._id?.slice(-8)}</td>
                  <td>{o.createdBy?.userName || o.createdBy?.email || "-"}</td>
                  <td>{o.course?.title || "-"}</td>
                  <td>₹{o.amount ?? o.payableAmount ?? "-"}</td>
                  <td>
                    <span className="text-xs px-2 py-1 rounded bg-slate-100">
                      {o.status || o.paymentStatus || "-"}
                    </span>
                  </td>
                  <td className="text-xs text-slate-500">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    No orders.
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
