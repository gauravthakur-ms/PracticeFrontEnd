import React from "react";
import HeroWithoutBanner from "../../../Components/UI/HeroWithoutBanner/HeroWithoutBanner";
import Card from "../../../Components/UI/Card/Card";
import { portraitImg, profileDetails } from "../../../Utils/Constant";

const Founder = () => {
  return (
    <div className="pt-15.5 md:pt-10">
      <div className="pt-15.5 md:pt-10">
        <div className="py-28 px-6 bg-white">
          <div className="max-w-6xl mx-auto space-y-16">
            <HeroWithoutBanner
              label="LEADERSHIP"
              heading="Visionaries & Guardians"
              description="The leadership team blends community organizing, education, and technology to build durable programs for families worldwide."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 reveal-item visible">
              {
                profileDetails.map((profile) => (
                  <div key={profile._id} className="flex flex-col items-center text-center lg:text-left lg:items-start lg:flex-row gap-8">
                    <div className="relative shrink-0">
                      <div className="w-60 h-60 sm:w-80 sm:h-80 lg:w-48 lg:h-48 rounded-4xl overflow-hidden shadow-xl border-4 border-[#FDFCF8]">
                        <img src={profile.image} alt={profile.name} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-3xl font-black text-slate-900 font-serif tracking-tighter">{profile.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mt-1">{profile.position}</p>
                      </div>
                      <p className="text-slate-600 text-lg leading-relaxed font-serif-elegant italic">{profile.description}</p>
                      <div className="lg:flex lg:flex-wrap lg:items-center mx-auto gap-3">
                        <a href={profile.url}
                         target="_blank"
                         className="lg:inline-flex lg:items-center gap-2 rounded-full bg-slate-900 text-white px-5 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition"
                        >
                          View full profile
                        </a>
                      </div>
                      <div className="flex lg:justify-start justify-center gap-6 pt-2">
                        {
                          Object.entries(profile.items).map(([key, value]) => (
                            <div key={key} className="">
                              <p className="text-2xl font-black text-slate-900">{value}</p> 
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{key}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-item visible">
              <Card
                cardClassName={
                  "bg-[#FDFCF8] border border-slate-100 rounded-[2rem] p-6"
                }
                label={"Principle 01"}
                description={
                  "Protection-first mindset for elders, immigrants, and families under pressure."
                }
              />
              <Card
                cardClassName={
                  "bg-[#FDFCF8] border border-slate-100 rounded-[2rem] p-6"
                }
                label={"Principle 02"}
                description={
                  "Transparent governance with accountable data reporting and public updates."
                }
              />
              <Card
                cardClassName={
                  "bg-[#FDFCF8] border border-slate-100 rounded-[2rem] p-6"
                }
                label={"Principle 03"}
                description={
                  "Technology as a shield: digital tools that reduce harm and increase access."
                }
              />
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white reveal-item visible">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2">
                    <h3 className="text-3xl md:text-4xl font-black font-serif mb-4">Advisory Council</h3>
                    <p className="text-white/80 max-w-2xl">A multidisciplinary council guides impact design, safety policy, and education quality. Experts in community care, cybersecurity, and cultural education support each launch.</p>
                  </div>
                  <div className="flex gap-3 justify-start lg:justify-end">
                    {portraitImg.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Advisory Council Member ${index + 1}`}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Founder;
