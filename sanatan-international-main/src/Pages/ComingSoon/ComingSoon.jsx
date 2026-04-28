import React from "react";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  return (
    <div className="pt-15.5 md:pt-10">
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3] py-28 px-6">
        <div className="max-w-xl text-center space-y-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-orange-500 font-black">
            Page Under Construction
          </p>

          <h1 className="text-4xl md:text-5xl font-black text-slate-800 font-serif">
            Coming Soon
          </h1>

          <p className="text-slate-600 text-lg">
            This section is currently being developed. We are working to bring
            meaningful content here very soon.
          </p>

          <div className="flex justify-center">
            <Link
              to="/"
              className="px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
