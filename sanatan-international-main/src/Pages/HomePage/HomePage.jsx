import React from "react";
import Hero from "../../Components/HomePage/Hero/Hero";
import Feature from "../../Components/HomePage/Feature/Feature";
import SecondFeature from "../../Components/HomePage/SecondFeature/SecondFeature";
import LandSection from "../../Components/HomePage/LandSection/LandSection";
import Progress from "../../Components/HomePage/Progress/Progress";
import TrainingCampus from "../../Components/HomePage/TrainingCampus/TrainingCampus";
import Marketplace from "../../Components/HomePage/Marketplace/Marketplace";
import CommunityCircles from "../../Components/HomePage/CommunityCircles/CommunityCircles";

const HomePage = () => {
  return (
    <div className="pt-15.5 md:pt-10">
      <Hero />
      <Feature />
      {/* sanskrit shloka section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-serif-elegant italic text-slate-600">
            “योगः कर्मसु कौशलम्” — Bhagavad Gita 2.50
          </p>
          <p className="text-xs uppercase tracking-widest text-slate-400 mt-2">
            Yoga is excellence in action.
          </p>
        </div>
      </section>
      <SecondFeature />
      <LandSection />
      <Progress />
      <TrainingCampus />
      <Marketplace />
      <CommunityCircles />
    </div>
  );
};

export default HomePage;
