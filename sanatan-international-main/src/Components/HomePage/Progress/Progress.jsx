import React from "react";

const Progress = () => {
  const progressData = [
    {
      timeLine: "Jan 2024",
      desc: "Registered as a public-benefit initiative; community advisory circle formed.",
    },
    {
      timeLine: "Apr 2024",
      desc: "Digital safety toolkit launched for seniors and families.",
    },
    {
      timeLine: "Aug 2024",
      desc: "Volunteer network onboarded across 3 regions.",
    },
    {
      timeLine: "Dec 2024",
      desc: "Curriculum framework published for Gurukul levels 1–3.",
    },
    {
      timeLine: "Mar 2025",
      desc: "Land due-diligence phase initiated for El-Sabrante campus.",
    },
    {
      timeLine: "Jul 2025",
      desc: "Research ethics policy and governance handbook published.",
    },
  ];
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-3">
            Our work in 2024–2025
          </p>
          <p className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
            Measured progress, documented publicly
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressData.map((item, index) => (
            <div
              key={index}
              className="bg-[#FDFCF8] border border-slate-100 rounded-4xl p-6"
            >
              <p className="text-[10px] uppercase tracking-widest text-orange-500 font-black">
                {item.timeLine}
              </p>
              <p className="text-sm text-slate-600 mt-3">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Progress;
