import React from "react";
import HeroWithoutBanner from "../../../Components/UI/HeroWithoutBanner/HeroWithoutBanner";
import Description from "../../../Components/UI/Description/Description";
import CardWithBulletPoint from "../../../Components/UI/CardWithBulletPoint/CardWithBulletPoint";
import { aboutGridContent, cardBulletPoints } from "../../../Utils/Constant";
import SectionBanner from "../../../Components/UI/SectionBanner/SectionBanner";
import sectionBannerImg from "../../../Assets/map-world.png";
const About = () => {
  return (
    <div className="pt-15.5 md:pt-10">
      <div className="py-28 px-6 bg-[#FAF8F3]">
        <div className="max-w-6xl mx-auto space-y-16">
          <HeroWithoutBanner
            label="About the Centre"
            heading="SANATAN INTERNATIONAL CENTRE FOR HUMAN FLOURISHING"
            description="A non-sectarian educational and research initiative focused on human development through mind training, ethical action, preventive health education, and responsible innovation."
          />

          {/* about content section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start reveal-item visible">
            <div className="space-y-6">
              <Description
                text={
                  "We treat classical Sanatan texts as knowledge systems—taught with academic respect and public accountability."
                }
                style="text-slate-700 text-xl font-serif-elegant italic"
              />
              <div className="bg-[#FDFCF8] border border-slate-100 rounded-4xl p-6">
                <p className="text-[10px] uppercase tracking-[0.4em] text-orange-500 font-black mb-3">
                  Recent outcomes
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    2024: Digital safety toolkit shipped to 1,200+ families.
                  </li>
                  <li>
                    2025: 3 volunteer hubs activated with verified onboarding.
                  </li>
                  <li>
                    2025: Curriculum framework released for public review.
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                {aboutGridContent.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-100 p-4"
                  >
                    <p className="font-bold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <CardWithBulletPoint
              label="What makes this different"
              items={cardBulletPoints}
            />
          </div>

          {/* section banner */}
          <SectionBanner
            img={sectionBannerImg}
            alt="Global footprint"
            label="Sanskrit Principle"
            heading="“एकं सद्विप्रा बहुधा वदन्ति”"
            description="Truth is one; it is expressed in many ways. (Rig Veda 1.164.46)"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
