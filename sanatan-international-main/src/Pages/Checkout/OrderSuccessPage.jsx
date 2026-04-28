import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const courseId = params.get("courseId");

  return (
    <div className="min-h-screen bg-[#FAF8F3] pt-32 pb-16 px-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 max-w-lg w-full text-center">
        <FaCheckCircle className="text-green-500 mx-auto" size={64} />
        <h1 className="font-serif-elegant text-3xl text-slate-800 mt-4 mb-2">You're enrolled!</h1>
        <p className="text-slate-600 mb-6">
          Your enrollment is being processed. You'll be granted access shortly.
        </p>
        <div className="space-y-2">
          {courseId && (
            <Link
              to={`/my-courses/${courseId}`}
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md"
            >
              Start Learning
            </Link>
          )}
          <Link
            to="/courses"
            className="block w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-md"
          >
            Browse More Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
