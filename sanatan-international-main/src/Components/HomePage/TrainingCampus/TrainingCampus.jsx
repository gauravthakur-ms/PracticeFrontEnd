import React from "react";
import { useNavigate } from "react-router-dom";

const TrainingCampus = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-6 brand-bg">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="brand-card rounded-[2.5rem] p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-4">
            El Sabrante Campus
          </p>
          <p className="text-3xl md:text-5xl font-black text-slate-900 mb-6 font-serif">
            Three sanctuaries, one mission
          </p>
          <div className="space-y-4 text-slate-600 text-sm">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-2"></span>
              <span>
                <strong>Yoga Campus</strong>
                for movement, breathwork, and daily wellness training.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-2"></span>
              <span>
                <strong>Meditation and Skill Training</strong>
                for focus, intuition, and leadership development.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-2"></span>
              <span>
                <strong>Research and Development</strong>
                to create physical and digital tools for better living.
              </span>
            </div>
          </div>
        </div>
        <div className="brand-card rounded-[2.5rem] p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-4">
            Community Path
          </p>
          <p className="text-2xl font-black text-slate-900 mb-4 font-serif">
            Support the land vision
          </p>
          <p className="text-slate-600 font-serif-elegant italic mb-6">
            Land is the anchor for learning, care, and cultural continuity. Your
            support builds classrooms, halls, and healing spaces.
          </p>
          <button
            onClick={() => navigate("/donate")}
            className="bg-orange-500 text-white px-7 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all"
          >
            Contribute to the Campus
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrainingCampus;
