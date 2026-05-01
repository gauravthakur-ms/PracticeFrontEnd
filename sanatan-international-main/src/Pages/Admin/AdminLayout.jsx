import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../store/authStore";

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users", platformOnly: true },
  { to: "/admin/requests", label: "Admin Requests", platformOnly: true },
];

export default function AdminLayout({ title, action, children }) {
  const { user } = useAuth();
  const isPlatformAdmin =
    user?.role === "super_admin" || user?.role === "customer_panel_admin";
  const items = NAV.filter((n) => !n.platformOnly || isPlatformAdmin);
  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-56 shrink-0">
            <nav className="bg-white rounded-xl p-3 border border-slate-100 sticky top-28">
              {items.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-sm rounded-md mb-1 ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <Link
                to="/"
                className="block px-3 py-2 text-xs text-slate-500 hover:text-orange-500 mt-2 border-t border-slate-100 pt-2"
              >
                ← Back to site
              </Link>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <h1 className="font-serif-elegant text-2xl text-slate-800">{title}</h1>
              {action}
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
