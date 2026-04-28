import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import authService from "../../services/auth.service";
import useAuthStore, { useAuth } from "../../store/authStore";

const TABS = ["Profile", "Security", "Admin Request"];

const initials = (name = "") =>
  name.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "U";

export default function ProfilePage() {
  const { user } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [tab, setTab] = useState("Profile");

  if (!user) return null;
  const isPlainUser = user.role === "user";

  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif-elegant text-3xl text-slate-800 mb-6">My Profile</h1>

        <div className="flex gap-2 border-b border-slate-200 mb-6">
          {TABS.filter((t) => t !== "Admin Request" || isPlainUser).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                tab === t
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-slate-600 hover:text-orange-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Profile" && (
          <ProfileTab user={user} setUser={setUser} accessToken={accessToken} />
        )}
        {tab === "Security" && <SecurityTab />}
        {tab === "Admin Request" && isPlainUser && <AdminRequestTab />}
      </div>
    </div>
  );
}

function ProfileTab({ user, setUser, accessToken }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { username: user.userName || "", fullname: user.fullName || "" },
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const avatarUrl = user.avatar?.url || user.avatar || null;

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      // Backend currently accepts JSON for username/fullname (no multer for avatar).
      // Send JSON; avatar upload requires backend multer/S3 wiring.
      if (avatarFile) {
        toast("Avatar upload not yet supported on the server", { icon: "ℹ️" });
      }
      const res = await authService.updateProfile(user._id, {
        username: values.username,
        fullname: values.fullname,
      });
      const data = res.data?.data;
      const updated = data?.updatedUser || data;
      if (updated) setUser(updated, accessToken);
      toast.success("Profile updated");
      setAvatarFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 border border-slate-100 space-y-5">
      <div className="flex items-center gap-4">
        {avatarFile ? (
          <img src={URL.createObjectURL(avatarFile)} alt="" className="w-20 h-20 rounded-full object-cover" />
        ) : avatarUrl ? (
          <img src={avatarUrl} alt={user.userName} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <span className="w-20 h-20 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl">
            {initials(user.userName || user.email)}
          </span>
        )}
        <label className="text-sm text-orange-500 cursor-pointer hover:underline">
          Change avatar
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      <div>
        <label className="block text-sm text-slate-700 mb-1">Username</label>
        <input {...register("username")} className="auth-input" />
      </div>
      <div>
        <label className="block text-sm text-slate-700 mb-1">Full Name</label>
        <input {...register("fullname")} className="auth-input" />
      </div>
      <div>
        <label className="block text-sm text-slate-700 mb-1">Email</label>
        <input value={user.email} disabled className="auth-input bg-slate-50 text-slate-500" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-wide bg-slate-100 px-2 py-1 rounded">{user.role}</span>
        {user.isEmailVerified && (
          <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">Verified</span>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-md"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

function SecurityTab() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const onSubmit = async (values) => {
    try {
      await authService.changePassword(values);
      toast.success("Password changed");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 border border-slate-100 space-y-4 max-w-md">
      <div>
        <label className="block text-sm text-slate-700 mb-1">Old Password</label>
        <input type="password" {...register("oldPassword", { required: true })} className="auth-input" />
      </div>
      <div>
        <label className="block text-sm text-slate-700 mb-1">New Password</label>
        <input type="password" {...register("newPassword", { required: true })} className="auth-input" />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-md"
      >
        {isSubmitting ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}

function AdminRequestTab() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { role: "course_admin" },
  });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (values) => {
    try {
      await authService.submitAdminRequest(values);
      toast.success("Request submitted");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-100">
        <p className="text-slate-700">
          Your request has been submitted. A super-admin will review it shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 border border-slate-100 space-y-4 max-w-md">
      <p className="text-sm text-slate-600">
        Apply to become a Course Admin. You'll be able to create and manage courses once approved.
      </p>
      <div>
        <label className="block text-sm text-slate-700 mb-1">Role</label>
        <select {...register("role", { required: true })} className="auth-input">
          <option value="course_admin">Course Admin</option>
          <option value="customer_panel_admin">Customer Panel Admin</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-md"
      >
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
