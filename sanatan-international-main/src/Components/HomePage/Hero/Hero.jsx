import React from "react";
import img from "../../../assets/Home/hero-lotus-temple.jpg";
import "./Hero.css";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center text-white pt-24 pb-10 brand-night">
      <div className="absolute inset-0">
        <img
          src={img}
          alt="Hero background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/70 via-slate-950/40 to-slate-950/80"></div>
        <div className="absolute -top-30.5 -right-20 brand-orb"></div>
        <div className="absolute -bottom-40 -left-30.5 brand-orb"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full brand-glass mb-8">
          <div className="lotus-motif"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">
            Ancient human sciences. Modern execution. Public benefit.
          </span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[0.95] font-ancient tracking-tighter uppercase text-mist">
          Sanatan International
          <br />
          <span className="gradient-gold font-serif italic italic-elegant tracking-normal">
            Centre for Human Flourishing
          </span>
        </h1>
        <p className="text-base md:text-xl max-w-3xl mx-auto mb-6 text-slate-100 font-serif-elegant italic leading-relaxed">
          Ancient human sciences. Modern execution. Public benefit.
        </p>
        <p className="text-xs md:text-sm max-w-3xl mx-auto mb-3 text-white/85 font-black uppercase tracking-widest">
          We are building a permanent campus in El-Sabrante (33 acres) for
          Gurukul-based skill & consciousness education, Ayurveda research &
          preventive health education, ethical human-centric technology, and
          sustainable indigenous production.
        </p>
        <p className="text-[10px] md:text-xs max-w-3xl mx-auto mb-8 text-white/70 font-black uppercase tracking-widest">
          Primary goal right now: Land acquisition.
        </p>

        {/* button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/donate")}
            className="cursor-pointer bg-orange-500 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all"
          >
            Donate to Land Fund
          </button>
          <button
            onClick={() => navigate("/courses")}
            className="cursor-pointer bg-white text-slate-900 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-200 transition-all"
          >
            Explore Programs
          </button>
          <button
            onClick={() => navigate("/financial-reports")}
            className="cursor-pointer bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all"
          >
            View Transparency
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
