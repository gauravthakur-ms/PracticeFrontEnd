import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import authService from "../../services/auth.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";

const STATUS_TABS = ["pending", "accepted", "rejected"];

export default function AdminRequestsPage() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authService.getAdminRequests();
      const all = res.data?.data || [];
      setItems(all);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await authService.updateAdminRequest(id, { status });
      toast.success(`Request ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const filtered = items.filter((i) => (i.status || "pending") === tab);

  return (
    <AdminLayout title="Admin Requests">
      <div className="flex gap-2 mb-4">
        {STATUS_TABS.map((t) => (
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
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-500 py-10">No {tab} requests.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r._id} className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-slate-800">
                    {r.user?.userName || r.user?.email || "User"}
                  </p>
                  <p className="text-xs text-slate-500">{r.user?.email}</p>
                </div>
                <span className="text-xs uppercase tracking-wide bg-slate-100 px-2 py-1 rounded">
                  {r.role}
                </span>
              </div>
              {r.reason && <p className="text-sm text-slate-600 mb-3">{r.reason}</p>}
              {tab === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(r._id, "accepted")}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(r._id, "rejected")}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
