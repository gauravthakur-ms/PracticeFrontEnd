import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import subjectService from "../../services/subject.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";
import ConfirmModal from "../../Components/shared/ConfirmModal";

export default function AdminSubjectsPage() {
  const { courseId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await subjectService.getSubjects(courseId);
      setSubjects(res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const addSubject = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await subjectService.createSubject(courseId, { title: newTitle.trim() });
      toast.success("Subject added");
      setNewTitle("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;
    try {
      await subjectService.updateSubject(courseId, id, { title: editingTitle.trim() });
      toast.success("Updated");
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await subjectService.deleteSubject(courseId, confirmId);
      toast.success("Deleted");
      setConfirmId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <AdminLayout
      title="Subjects"
      action={
        <Link to="/admin/courses" className="text-sm text-orange-500 hover:underline">
          ← All courses
        </Link>
      }
    >
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 text-sm text-slate-700">
        Add a subject below, then click <strong>Lessons</strong> next to it to upload videos for that subject.
      </div>

      <form onSubmit={addSubject} className="bg-white rounded-xl border border-slate-100 p-4 mb-5 flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New subject title"
          className="auth-input flex-1"
        />
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md font-semibold">
          Add
        </button>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100">
          {subjects.length === 0 ? (
            <p className="p-6 text-center text-slate-500">No subjects yet.</p>
          ) : (
            subjects.map((s, idx) => (
              <div key={s._id} className="flex items-center gap-3 p-3">
                <span className="text-xs text-slate-400 w-6">{idx + 1}</span>
                {editingId === s._id ? (
                  <>
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="auth-input flex-1"
                    />
                    <button
                      onClick={() => saveEdit(s._id)}
                      className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm text-slate-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium text-slate-800">{s.title}</span>
                    <span className="text-xs text-slate-500">
                      {s.numberOfLessons || s.lessons?.length || 0} lessons
                    </span>
                    <Link
                      to={`/admin/courses/${courseId}/subjects/${s._id}/lessons`}
                      className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded font-medium"
                    >
                      Lessons / Videos
                    </Link>
                    <button
                      onClick={() => {
                        setEditingId(s._id);
                        setEditingTitle(s.title);
                      }}
                      className="text-sm text-slate-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmId(s._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <ConfirmModal
        open={!!confirmId}
        title="Delete subject?"
        message="This will also delete all lessons under this subject."
        destructive
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </AdminLayout>
  );
}
