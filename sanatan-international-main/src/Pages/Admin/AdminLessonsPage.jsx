import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import lessonService from "../../services/lesson.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";
import ConfirmModal from "../../Components/shared/ConfirmModal";
import ProgressBar from "../../Components/shared/ProgressBar";

const fmtDuration = (ms) => {
  if (!ms) return "-";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function AdminLessonsPage() {
  const { courseId, subjectId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { duration: 0 } });

  const load = async () => {
    setLoading(true);
    try {
      const res = await lessonService.getLessons(courseId, subjectId);
      setLessons(res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, subjectId]);

  const onCreate = async (values) => {
    if (!values.videoUrl && !videoFile) {
      return toast.error("Provide a video URL or select a file to upload");
    }
    setUploading(true);
    setProgress(0);
    try {
      let videoUrl = values.videoUrl?.trim() || "";
      if (!videoUrl && videoFile) {
        // S3 presign flow
        const { default: uploadService } = await import("../../services/upload.service");
        const presignRes = await uploadService.presignVideo({
          contentType: videoFile.type,
          sizeBytes: videoFile.size,
          fileName: videoFile.name,
        });
        const { url, fields, finalUrl } = presignRes.data?.data || {};
        if (!url) throw new Error("Presign failed (S3 not configured on backend?)");
        const fd = new FormData();
        Object.entries(fields || {}).forEach(([k, v]) => fd.append(k, v));
        fd.append("file", videoFile);
        await fetch(url, { method: "POST", body: fd });
        videoUrl = finalUrl;
        setProgress(100);
      }
      await lessonService.createLesson(courseId, subjectId, {
        title: values.title,
        duration: Number(values.duration) || 0,
        videoUrl,
      });
      toast.success("Lesson created");
      reset({ title: "", duration: 0, videoUrl: "" });
      setVideoFile(null);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await lessonService.deleteLesson(courseId, subjectId, confirmId);
      toast.success("Deleted");
      setConfirmId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <AdminLayout
      title="Lessons"
      action={
        <div className="flex gap-2">
          <Link to={`/admin/courses/${courseId}/subjects`} className="text-sm text-orange-500 hover:underline">
            ← Subjects
          </Link>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
          >
            {showForm ? "Cancel" : "+ Add Lesson"}
          </button>
        </div>
      }
    >
      {showForm && (
        <form
          onSubmit={handleSubmit(onCreate)}
          className="bg-white rounded-xl border border-slate-100 p-5 mb-5 space-y-4"
        >
          <div>
            <label className="block text-sm text-slate-700 mb-1">Title</label>
            <input {...register("title", { required: true })} className="auth-input" />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Duration (ms)</label>
            <input
              type="number"
              {...register("duration", { valueAsNumber: true })}
              className="auth-input"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Video URL (paste a direct/HLS URL — recommended if S3 is not set up)
            </label>
            <input
              type="url"
              {...register("videoUrl")}
              placeholder="https://example.com/video.mp4"
              className="auth-input"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              ...or upload a file (requires backend S3 config)
            </label>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
            {videoFile && (
              <p className="text-xs text-slate-500 mt-1">
                {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
              </p>
            )}
          </div>
          {uploading && <ProgressBar value={progress} label="Uploading..." />}
          <button
            type="submit"
            disabled={uploading}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-md"
          >
            {uploading ? "Uploading..." : "Create Lesson"}
          </button>
        </form>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">#</th>
                <th>Title</th>
                <th>Duration</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lessons.map((l, idx) => (
                <tr key={l._id}>
                  <td className="p-3">{l.order ?? idx + 1}</td>
                  <td>{l.title}</td>
                  <td>{fmtDuration(l.duration)}</td>
                  <td className="text-right pr-4">
                    <button
                      onClick={() => setConfirmId(l._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">
                    No lessons yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!confirmId}
        title="Delete lesson?"
        destructive
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </AdminLayout>
  );
}
