import React from "react";
import HeroWithoutBanner from "../../../Components/UI/HeroWithoutBanner/HeroWithoutBanner";
import Quote from "../../../Components/UI/Quote/Quote";
import CardWithBulletPoint from "../../../Components/UI/CardWithBulletPoint/CardWithBulletPoint";
import { missionBulletPoints } from "../../../Utils/Constant";

const Vision = () => {
  return (
    <div className="pt-15.5 md:pt-10">
      <div className="py-28 px-6 bg-[#FAF8F3]">
        <div className="max-w-6xl mx-auto space-y-16">
          <HeroWithoutBanner
            label="Vision & Mission"
            heading="Vision & Mission"
            spanHeading="for Human Flourishing"
            description="To establish a globally respected, non-sectarian educational and research institution dedicated to holistic human development by preserving, applying, and advancing time-tested knowledge systems for public welfare."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start reveal-item visible">
            <Quote
             label="Vision Quote"
             sanskrit="“सा विद्या या विमुक्तये” — Vishnu Purana 1.19.41"
             description="True knowledge is that which leads to human freedom."
             className="space-y-6"
             sanskritClassName="text-2xl md:text-3xl leading-[1.6] font-serif-elegant italic text-slate-700"
            />
            <CardWithBulletPoint
             label={"Mission"}
             items={missionBulletPoints}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal-item visible">
            <Quote
            label="Mission Quote"
            sanskrit="“लोकसंग्रहमेवापि सम्पश्यन् कर्तुमर्हसि” — Bhagavad Gita 3.20"
            description="Work should be done for the stability and welfare of society."
            className="bg-white border border-slate-100 rounded-4xl p-6"
            sanskritClassName="text-slate-600 font-serif-elegant italic mt-3"
            />
            <Quote
            label="Inclusive Work"
            description="Programs are non-sectarian, accountable, and open to all backgrounds."
            className="bg-white border border-slate-100 rounded-4xl p-6 space-y-3"
            />
          </div>


        </div>
      </div>
    </div>
  );
};

export default Vision;
