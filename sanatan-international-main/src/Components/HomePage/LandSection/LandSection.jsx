import React from "react";
import "./LandSection.css";
import { useNavigate } from "react-router-dom";

const LandSection = () => {
  const navigate = useNavigate();
  const landsectionData = [
    { title: "Permanance", desc: "Asset held for public benefit" },
    { title: "Independence", desc: "Mission protected from drift" },
    { title: "Planning", desc: "Long-term program stability" },
    { title: "Continuity", desc: "Education + research for generations" },
  ];
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="reveal-item visible">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-4">
            Why Land First
          </p>
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 font-serif">
            Buildings can come later. Land makes this mission permanent.
          </h3>
          <p className="text-slate-600 text-lg font-serif-elegant italic mb-6">
            A permanent home ensures independence, long-term planning, and
            protection from mission drift.
          </p>
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-6">
            “नायमात्मा प्रवचनेन लभ्यः” — Katha Upanishad 1.2.23
            <span className="block mt-2 text-[10px] tracking-[0.3em]">
              Inner knowledge isn’t gained by speech alone; it needs discipline
              and environment.
            </span>
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/donate")}
              className="bg-slate-900 text-white px-7 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all"
            >
              Donate to Land Fund
            </button>
            <button
              onClick={() => navigate("/financial-reports")}
              className="text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-slate-900 transition-all"
            >
              View Transparency
            </button>
          </div>
        </div>
        <div className="relative brand-card rounded-[2.5rem] p-8 overflow-hidden">
          <div className="absolute inset-0 brand-grid opacity-50"></div>
          <div className="relative z-10 grid grid-cols-2 gap-4">
            {landsectionData.map((item, index) => (
                <div key={index} className="bg-white/80 rounded-2xl p-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">{item.title}</p>
                  <p className="text-sm font-black text-slate-900">{item.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandSection;
