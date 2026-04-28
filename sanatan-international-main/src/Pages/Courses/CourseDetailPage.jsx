import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import courseService from "../../services/course.service";
import subjectService from "../../services/subject.service";
import reviewService from "../../services/review.service";
import { useAuth } from "../../store/authStore";
import StarRating from "../../Components/shared/StarRating";
import LoadingSpinner from "../../Components/shared/LoadingSpinner";

const thumb = (c) => c?.thumbnail?.[0]?.url || "https://placehold.co/1200x400?text=Course";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [openSubject, setOpenSubject] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(8);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [c, revs] = await Promise.all([
          courseService.getCourseById(courseId),
          reviewService.getCourseReviews(courseId).catch(() => ({ data: { data: [] } })),
        ]);
        if (!mounted) return;
        const cd = c.data?.data;
        setCourse(Array.isArray(cd) ? cd[0] : cd);
        setReviews(revs.data?.data || []);

        // Subjects endpoint is JWT-protected — only fetch for logged-in users.
        // Guests still see the rest of the details page and can click "Enroll Now".
        if (isAuthenticated) {
          try {
            const subs = await subjectService.getSubjects(courseId);
            if (mounted) setSubjects(subs.data?.data || []);
          } catch {
            // ignore — subjects will simply not render
          }

          try {
            const my = await courseService.getMyCourses();
            const ids = (my.data?.data || []).map((p) => p?.course?._id || p?.course || p?._id);
            setPurchased(ids.some((id) => String(id) === String(courseId)));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load course");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [courseId, isAuthenticated]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!course)
    return (
      <div className="pt-32 text-center">
        <p>Course not found.</p>
        <Link to="/courses" className="text-orange-500">Back to courses</Link>
      </div>
    );

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${courseId}` } });
      return;
    }
    if (purchased) {
      navigate(`/my-courses/${courseId}`);
      return;
    }
    navigate(`/checkout/${courseId}`);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return toast.error("Please write a review");
    setSubmittingReview(true);
    try {
      await reviewService.postReview(courseId, {
        review: reviewText,
        rating: Number(reviewRating),
      });
      toast.success("Review submitted — pending approval");
      setReviewText("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const hasDiscount = Number(course.discountPercent) > 0;

  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header banner */}
        <div className="relative h-72 rounded-2xl overflow-hidden mb-6">
          <img src={thumb(course)} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            {course.label && (
              <span className="inline-block bg-orange-500 px-3 py-1 text-xs uppercase tracking-wider rounded-full mb-2">
                {course.label}
              </span>
            )}
            <h1 className="font-serif-elegant text-4xl">{course.title}</h1>
            {course.createdBy?.userName && (
              <p className="text-sm mt-1 opacity-90">By {course.createdBy.userName}</p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="bg-white rounded-xl p-5 flex flex-wrap items-center gap-6">
              <StarRating value={course.averageRating || 0} />
              <span className="text-slate-500 text-sm">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
              {hasDiscount && (
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">
                  {course.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            {course.description && (
              <section>
                <h2 className="font-serif-elegant text-2xl text-slate-800 mb-2">About this course</h2>
                <p className="text-slate-600 whitespace-pre-line">{course.description}</p>
              </section>
            )}

            {/* Subjects accordion */}
            <section>
              <h2 className="font-serif-elegant text-2xl text-slate-800 mb-3">Course content</h2>
              {!isAuthenticated ? (
                <p className="text-sm text-slate-500">
                  Sign in and enroll to unlock the full course content.
                </p>
              ) : subjects.length === 0 ? (
                <p className="text-sm text-slate-500">Course content will be available after enrollment.</p>
              ) : (
                <div className="bg-white rounded-xl divide-y divide-slate-100 border border-slate-100">
                  {subjects.map((s) => (
                    <div key={s._id}>
                      <button
                        onClick={() => setOpenSubject(openSubject === s._id ? null : s._id)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
                      >
                        <span className="font-medium text-slate-800">{s.title}</span>
                        <span className="text-xs text-slate-500">
                          {s.numberOfLessons || s.lessons?.length || 0} lessons
                        </span>
                      </button>
                      {openSubject === s._id && (
                        <div className="px-6 pb-4 text-sm text-slate-600">
                          {(s.lessons || []).map((l) => (
                            <div key={l._id || l.title} className="flex justify-between py-1">
                              <span>{l.title}</span>
                              <span className="text-slate-400">
                                {l.duration ? `${Math.round(l.duration / 60000)}m` : ""}
                              </span>
                            </div>
                          ))}
                          {(!s.lessons || s.lessons.length === 0) && (
                            <p className="text-slate-400 italic">Lessons unlock after enrollment.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Reviews */}
            <section>
              <h2 className="font-serif-elegant text-2xl text-slate-800 mb-3">Reviews</h2>
              <div className="space-y-3">
                {reviews.length === 0 && (
                  <p className="text-sm text-slate-500">No reviews yet.</p>
                )}
                {reviews.map((r) => (
                  <div key={r._id} className="bg-white rounded-lg p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800">
                        {r.createdBy?.userName || "Student"}
                      </span>
                      <StarRating value={r.rating || 0} size="text-xs" />
                    </div>
                    <p className="text-slate-600 text-sm">{r.review}</p>
                  </div>
                ))}
              </div>

              {isAuthenticated && purchased && (
                <form onSubmit={submitReview} className="mt-6 bg-white rounded-xl p-5 border border-slate-100">
                  <h3 className="font-medium text-slate-800 mb-2">Write a review</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-sm text-slate-600">Rating:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(e.target.value)}
                      className="w-16 border border-slate-300 rounded px-2 py-1 text-sm"
                    />
                    <span className="text-xs text-slate-400">/10</span>
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm mb-3"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-md text-sm"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </section>
          </div>

          {/* Sticky CTA */}
          <aside className="lg:sticky lg:top-32 h-fit bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-orange-600">
                ₹{course.payableAmount ?? course.totalPrice}
              </span>
              {hasDiscount && (
                <span className="text-sm text-slate-400 line-through">₹{course.totalPrice}</span>
              )}
            </div>

            {purchased ? (
              <div className="text-center mb-3">
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  <FaCheckCircle /> Already enrolled
                </span>
              </div>
            ) : null}

            <button
              onClick={handleEnroll}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md mb-3"
            >
              {purchased ? "Continue Learning" : isAuthenticated ? "Enroll Now" : "Sign in to Enroll"}
            </button>

            <ul className="text-sm text-slate-600 space-y-1 mt-4">
              <li>✓ Lifetime access</li>
              <li>✓ Certificate of completion</li>
              <li>✓ Mobile-friendly content</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
