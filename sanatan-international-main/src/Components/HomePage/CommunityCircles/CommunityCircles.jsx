import React from "react";
import { useNavigate } from "react-router-dom";

const CommunityCircles = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-3">
              Community Circles
            </p>
            <p className="text-4xl md:text-5xl font-black text-slate-900 font-serif">
              Upcoming gatherings
            </p>
          </div>
          <button
            onClick={() => {
              navigate("/events");
              window.scrollTo(0, 0);
            }}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-500"
          >
            View all events →
          </button>
        </div>
        <div className="text-left bg-[#FDFCF8] border border-slate-100 rounded-4xl p-6 hover:shadow-lg transition-all">
          <span className="inline-block mb-3 rounded-full bg-orange-100 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">
            Coming Soon
          </span>

          <h3 className="font-serif-elegant text-xl text-slate-800">
            Upcoming Events & Gatherings
          </h3>

          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-lg">
            Sacred gatherings, community events, and cultural programs are being
            thoughtfully planned. Stay tuned for upcoming dates and announcements.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CommunityCircles;
