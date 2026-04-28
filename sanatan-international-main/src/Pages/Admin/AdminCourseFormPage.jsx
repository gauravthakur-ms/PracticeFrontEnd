import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import courseService from "../../services/course.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";

export default function AdminCourseFormPage() {
  const { courseId } = useParams();
  const isEdit = !!courseId;
  const navigate = useNavigate();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      title: "",
      label: "",
      description: "",
      totalPrice: 0,
      discountPercent: 0,
    },
  });
  const totalPrice = Number(watch("totalPrice")) || 0;
  const discountPercent = Number(watch("discountPercent")) || 0;
  const payable = Math.max(0, totalPrice - (totalPrice * discountPercent) / 100);

  useEffect(() => {
    if (!isEdit) return;
    let mounted = true;
    (async () => {
      try {
        const res = await courseService.getCourseById(courseId);
        const cd = res.data?.data;
        const c = Array.isArray(cd) ? cd[0] : cd;
        if (!mounted) return;
        if (c) {
          reset({
            title: c.title || "",
            label: c.label || "",
            description: c.description || "",
            totalPrice: c.totalPrice || 0,
            discountPercent: c.discountPercent || 0,
          });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [courseId, isEdit, reset]);

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        title: values.title,
        label: values.label,
        description: values.description,
        totalPrice: Number(values.totalPrice),
        discountPercent: Number(values.discountPercent),
      };
      let body = payload;
      if (thumbnailFile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
        fd.append("thumbnail", thumbnailFile);
        body = fd;
      }
      if (isEdit) {
        await courseService.updateCourse(courseId, body);
        toast.success("Course updated");
      } else {
        await courseService.createCourse(body);
        toast.success("Course created");
      }
      navigate("/admin/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Course">
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? "Edit Course" : "New Course"}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl border border-slate-100 p-6 max-w-2xl space-y-4"
      >
        <div>
          <label className="block text-sm text-slate-700 mb-1">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
          {thumbnailFile && (
            <img
              src={URL.createObjectURL(thumbnailFile)}
              alt=""
              className="mt-2 w-48 h-28 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="block text-sm text-slate-700 mb-1">Title</label>
          <input {...register("title", { required: true })} className="auth-input" />
        </div>
        <div>
          <label className="block text-sm text-slate-700 mb-1">Label / Category</label>
          <input {...register("label")} className="auth-input" />
        </div>
        <div>
          <label className="block text-sm text-slate-700 mb-1">Description</label>
          <textarea {...register("description")} rows={4} className="auth-input" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Total Price</label>
            <input
              type="number"
              {...register("totalPrice", { valueAsNumber: true })}
              className="auth-input"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Discount %</label>
            <input
              type="number"
              {...register("discountPercent", { valueAsNumber: true })}
              className="auth-input"
              min="0"
              max="100"
            />
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded p-3 text-sm">
          Payable amount: <strong>₹{payable.toFixed(2)}</strong>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-md"
          >
            {saving ? "Saving..." : isEdit ? "Update Course" : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="px-5 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
