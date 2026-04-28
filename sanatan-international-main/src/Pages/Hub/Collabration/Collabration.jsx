import React from "react";
import HeroWithoutBanner from "../../../Components/UI/HeroWithoutBanner/HeroWithoutBanner";
import SectionBanner from "../../../Components/UI/SectionBanner/SectionBanner";
import img from "../../../assets/meditation.jpg";
import Card from "../../../Components/UI/Card/Card";

const Collabration = () => {
  return (
    <div className="pt-15.5 md:pt-10">
      <div className="pt-15.5 md:pt-10">
        <div className="py-28 px-6 bg-white">
          <div className="max-w-6xl mx-auto space-y-16">
            <HeroWithoutBanner
              label="Collaborators"
              heading="Allies Who Build With Us"
              description="We partner with technology studios, educators, and community groups to deliver safer digital tools and stronger local support systems."
            />

            <SectionBanner
              img={img}
              alt="Collabration"
              label="Partnership model"
              heading="Shared goals. Shared accountability."
              description="Each partnership is aligned to measurable outcomes: safer elders, stronger youth education, and community resilience across borders."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-item visible">
              <Card
                cardClassName={
                  "bg-[#FDFCF8] border border-slate-100 rounded-[2rem] p-6"
                }
                label={"Co-Design"}
                description={
                  "Programs are built with community input and validated through pilots."
                }
              />
              <Card
                cardClassName={
                  "bg-[#FDFCF8] border border-slate-100 rounded-[2rem] p-6"
                }
                label={"Scale"}
                description={
                  "Successful pilots are rolled out across chapters with shared tooling."
                }
              />
              <Card
                cardClassName={
                  "bg-[#FDFCF8] border border-slate-100 rounded-[2rem] p-6"
                }
                label={"Measure"}
                description={
                  "Impact metrics are tracked and published with each cycle."
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collabration;
