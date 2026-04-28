import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";
import subjectService from "../../services/subject.service";
import lessonService from "../../services/lesson.service";
import courseService from "../../services/course.service";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";

const fmtDuration = (ms) => {
  if (!ms) return "";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const progressKey = (cid, lid) => `progress:${cid}:${lid}`;

export default function CourseContentPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]); // [{...subject, lessons: [...]}]
  const [openSubject, setOpenSubject] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null); // full lesson with fresh URL
  const [loading, setLoading] = useState(true);
  const [loadingLesson, setLoadingLesson] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [c, subs] = await Promise.all([
          courseService.getCourseById(courseId),
          subjectService.getSubjects(courseId),
        ]);
        if (!mounted) return;
        const cd = c.data?.data;
        setCourse(Array.isArray(cd) ? cd[0] : cd);
        const subjectsList = subs.data?.data || [];

        // Fetch lessons for each subject in parallel
        const withLessons = await Promise.all(
          subjectsList.map(async (s) => {
            try {
              const ls = await lessonService.getLessons(courseId, s._id);
              return { ...s, lessons: ls.data?.data || [] };
            } catch {
              return { ...s, lessons: [] };
            }
          }),
        );
        if (!mounted) return;
        setSubjects(withLessons);
        setOpenSubject(withLessons[0]?._id || null);
        // auto-select first lesson
        const firstLesson = withLessons.find((s) => s.lessons.length)?.lessons[0];
        if (firstLesson) selectLesson(withLessons[0]._id, firstLesson._id);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load course content");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const selectLesson = async (subjectId, lessonId) => {
    setLoadingLesson(true);
    try {
      const res = await lessonService.getLesson(courseId, subjectId, lessonId);
      setActiveLesson(res.data?.data || null);
      localStorage.setItem(progressKey(courseId, lessonId), "watched");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load lesson");
    } finally {
      setLoadingLesson(false);
    }
  };

  const flatLessons = useMemo(() => {
    return subjects.flatMap((s) =>
      (s.lessons || []).map((l) => ({ subjectId: s._id, lessonId: l._id })),
    );
  }, [subjects]);

  const currentIndex = useMemo(() => {
    if (!activeLesson) return -1;
    return flatLessons.findIndex((x) => x.lessonId === activeLesson._id);
  }, [flatLessons, activeLesson]);

  const goPrev = () => {
    if (currentIndex > 0) {
      const p = flatLessons[currentIndex - 1];
      selectLesson(p.subjectId, p.lessonId);
    }
  };
  const goNext = () => {
    if (currentIndex >= 0 && currentIndex < flatLessons.length - 1) {
      const n = flatLessons[currentIndex + 1];
      selectLesson(n.subjectId, n.lessonId);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link to="/my-courses" className="text-sm text-orange-500 hover:underline">
              ← My Courses
            </Link>
            <h1 className="font-serif-elegant text-2xl text-slate-800">{course?.title}</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 bg-white rounded-xl border border-slate-100 max-h-[80vh] overflow-y-auto">
            {subjects.map((s) => (
              <div key={s._id} className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => setOpenSubject(openSubject === s._id ? null : s._id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">{s.title}</span>
                  <span className="text-xs text-slate-500">{s.lessons?.length || 0}</span>
                </button>
                {openSubject === s._id && (
                  <ul>
                    {(s.lessons || []).map((l) => {
                      const watched = localStorage.getItem(progressKey(courseId, l._id)) === "watched";
                      const active = activeLesson?._id === l._id;
                      return (
                        <li key={l._id}>
                          <button
                            onClick={() => selectLesson(s._id, l._id)}
                            className={`w-full flex items-center justify-between px-6 py-2 text-sm text-left ${
                              active
                                ? "bg-orange-50 text-orange-700"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {watched && <span className="text-green-500">✓</span>}
                              {l.title}
                            </span>
                            <span className="text-xs text-slate-400">{fmtDuration(l.duration)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </aside>

          {/* Player */}
          <main className="lg:col-span-2 space-y-4">
            {loadingLesson || !activeLesson ? (
              <div className="bg-black aspect-video rounded-xl flex items-center justify-center text-white text-sm">
                {loadingLesson ? "Loading lesson..." : "Select a lesson to begin"}
              </div>
            ) : (
              <>
                <div className="bg-black aspect-video rounded-xl overflow-hidden">
                  <ReactPlayer
                    url={activeLesson.videoUrl || activeLesson.video?.url}
                    controls
                    width="100%"
                    height="100%"
                    config={{ file: { attributes: { controlsList: "nodownload" } } }}
                  />
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-100">
                  <h2 className="font-serif-elegant text-xl text-slate-800 mb-1">
                    {activeLesson.title}
                  </h2>
                  {activeLesson.description && (
                    <p className="text-slate-600 text-sm">{activeLesson.description}</p>
                  )}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={goPrev}
                      disabled={currentIndex <= 0}
                      className="px-4 py-2 text-sm border rounded disabled:opacity-40"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={goNext}
                      disabled={currentIndex >= flatLessons.length - 1}
                      className="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
