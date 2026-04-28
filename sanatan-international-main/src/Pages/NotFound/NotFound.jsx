import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="pt-15.5 md:pt-10">
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3] py-28 px-6">
        <div className="text-center max-w-xl space-y-6">
          <h1 className="text-6xl font-black text-orange-500">404</h1>

          <h2 className="text-3xl font-serif text-slate-800">Page Not Found</h2>

          <p className="text-slate-600">
            The page you are looking for does not exist or may have been moved.
          </p>

          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
