import React from "react";
import HeroWithoutBanner from "../../../Components/UI/HeroWithoutBanner/HeroWithoutBanner";
import CardWithBulletPoint from "../../../Components/UI/CardWithBulletPoint/CardWithBulletPoint";
import { financialBulletPoints } from "../../../Utils/Constant";
import Quote from "../../../Components/UI/Quote/Quote";
import Card from "../../../Components/UI/Card/Card";

const Financial = () => {
  return (
    <div className="pt-15.5 md:pt-10">
      <div className="pt-15.5 md:pt-10">
        <div className="py-28 px-6 bg-white">
          <div className="max-w-6xl mx-auto space-y-16">
            <HeroWithoutBanner
              label="Financial Transparency"
              heading="TRANSPARENCY AND ACCOUNTABILITY"
              description="We operate with clear objectives, documented programs, ethical safeguards, and public reporting standards."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 reveal-item visible">
              <CardWithBulletPoint
                label={"What we publish"}
                labelColor="text-slate-400"
                color="bg-slate-50"
                items={financialBulletPoints}
              />

              <Quote
                label="Sanskrit Principle"
                sanskrit="“सत्यं वद” — Taittiriya Upanishad 1.11"
                description="Speak truth. Practice accountability."
                className="bg-white border border-slate-100 rounded-4xl p-8"
                sanskritClassName="mt-4"
                descriptionClassName="mt-0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-item visible">
              <Card
                cardClassName={
                  "bg-[#FDFCF8] border border-slate-100 rounded-[2rem] p-6"
                }
                label={"Spiritual & Ritual Policy"}
                sanskrit={"“ॐ इत्येतदक्षरं ब्रह्म” — Mandukya Upanishad 1"}
                description={
                  "Contemplative spaces are optional; no forced worship, no initiations, no miracle claims, no sect dominance."
                }
              />
              <Card
                cardClassName={
                  "bg-[#FDFCF8] border border-slate-100 rounded-[2rem] p-6"
                }
                label={"Faculty Ethics"}
                sanskrit={"“स्वाध्यायात्” — Yoga Sutra 2.44"}
                description={
                  "No guru culture, no personal followings, teaching must be text-grounded with strict student-safety boundaries."
                }
              />
              <Card
                cardClassName={
                  "bg-[#FDFCF8] border border-slate-100 rounded-[2rem] p-6"
                }
                label={"Ayurveda Ethics"}
                sanskrit={"“युक्ताहारविहारस्य” — Bhagavad Gita 6.17"}
                description={
                  "No clinical claims or unlicensed treatment; research and education only with compliant labeling."
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financial;
