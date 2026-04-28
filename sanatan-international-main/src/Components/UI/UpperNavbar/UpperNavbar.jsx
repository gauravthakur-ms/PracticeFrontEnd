import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore, { useAuth } from "../../../store/authStore";
import authService from "../../../services/auth.service";
import { ADMIN_ROLES } from "../../../AppRoutes/adminRoles";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

const UpperNavbar = () => {
  const { user, isAuthenticated } = useAuth();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    logout();
    setOpen(false);
    toast.success("Signed out");
    navigate("/");
  };

  const isAdmin = user && ADMIN_ROLES.includes(user.role);
  const avatar = user?.avatar?.url || user?.avatar || null;

  return (
    <header className="w-full bg-white/90 text-slate-600 backdrop-blur-md shadow-sm fixed top-0 z-[1100]">
      <div className="max-w-7xl mx-auto px-6 py-1.5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest">
        <div className="w-full flex items-center gap-2">
          <div className="relative">
            <IoSearchOutline
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search..."
              className="px-9 py-1 rounded-full bg-white border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <button className="w-8 h-7 rounded-full flex items-center justify-center cursor-pointer text-[9px] font-black transition-colors bg-slate-100 text-slate-600 hover:bg-orange-100">
            EN
          </button>
        </div>

        <div className="w-full flex items-center justify-end gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-xs font-bold tracking-wider cursor-pointer hover:text-orange-500 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold tracking-wider cursor-pointer hover:text-orange-500 transition-colors"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 hover:text-orange-500"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={user.userName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">
                    {initialsOf(user.userName || user.fullName || user.email)}
                  </span>
                )}
                <span className="text-xs normal-case">{user.userName || "Account"}</span>
              </button>
              {open && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-[1200] normal-case tracking-normal">
                  <Link
                    to="/my-courses"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-orange-50"
                  >
                    My Courses
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-orange-50"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-orange-50"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UpperNavbar;
