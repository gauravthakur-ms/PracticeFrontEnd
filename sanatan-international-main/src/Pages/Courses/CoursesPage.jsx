import { useEffect, useMemo, useState } from "react";
import courseService from "../../services/course.service";
import CourseCard from "../../Components/shared/CourseCard";
import SkeletonCard from "../../Components/shared/SkeletonCard";
import toast from "react-hot-toast";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [labelFilter, setLabelFilter] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await courseService.getAllCourses();
        if (mounted) setCourses(res.data?.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load courses");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const labels = useMemo(() => {
    const set = new Set(courses.map((c) => c.label).filter(Boolean));
    return Array.from(set);
  }, [courses]);

  const filtered = useMemo(() => {
    let list = labelFilter ? courses.filter((c) => c.label === labelFilter) : [...courses];
    switch (sort) {
      case "rating":
        list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "price_asc":
        list.sort((a, b) => (a.payableAmount || 0) - (b.payableAmount || 0));
        break;
      case "price_desc":
        list.sort((a, b) => (b.payableAmount || 0) - (a.payableAmount || 0));
        break;
      default:
        // server already sorted by createdAt desc
        break;
    }
    return list;
  }, [courses, labelFilter, sort]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif-elegant text-4xl text-slate-800 mb-2">Courses</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Explore our curated programs in spirituality, philosophy, and ancient wisdom.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-between mb-6">
          <div className="flex items-center gap-2">
            <select
              value={labelFilter}
              onChange={(e) => setLabelFilter(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="">All categories</option>
              {labels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-slate-500">{filtered.length} courses</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No courses available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
