import React from "react";
import "./SecondFeature.css";

const SecondFeature = () => {
  const secondFeatureData = [
    {
      title: "Gurukul (Education)",
      desc: "Structured training in discipline, focus, ethics, and life skills rooted in classical Yoga and ethics frameworks.",
    },
    {
      title: "Ayurveda (Research & Preventive Health)",
      desc: "Research, documentation, and education in lifestyle-centered well-being grounded in classical Ayurveda.",
    },
    {
      title: "Ethical Technology (Human Welfare R&D)",
      desc: "Tools designed to protect and support people—especially seniors and vulnerable users—without exploitative design.",
    },
  ];
  return (
    <section className="py-24 px-6 brand-bg">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {
            secondFeatureData.map((item,index)=>(
                <div key={index} className="brand-card rounded-4xl p-8">
                   <p className="text-[10px] uppercase tracking-[0.4em] text-orange-500 font-black mb-3">Pillar</p>
                   <h3 className="text-2xl font-black text-slate-900 mb-3 font-serif">{item.title}</h3>
                   <p className="text-slate-600 font-serif-elegant italic">{item.desc}</p>
                </div>
            ))}
      </div>
    </section>
  );
};

export default SecondFeature;
