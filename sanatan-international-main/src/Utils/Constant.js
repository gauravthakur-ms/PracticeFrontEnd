import pankaj from "../assets/Pankaj.png";
import vineeta from "../assets/Vineeta.png";
import portrait1 from "../assets/Portrait/portrait1.jpg";
import portrait2 from "../assets/Portrait/portrait2.jpg";
import portrait3 from "../assets/Portrait/portrait3.jpg";

const aboutGridContent = [
  "Mind training (Yoga Sutras framework)",
  "Ethical action (Gita-based discipline)",
  "Preventive health education (Ayurveda principles)",
  "Responsible innovation (human welfare technology)",
];
const cardBulletPoints = [
  "No hype. No miracle claims.",
  "No cult structure. No guru-brand culture.",
  "No addictive tech. No engagement traps.",
  "Programs are structured, measurable, and safety-first.",
];

const missionBulletPoints = [
  "Provide education and skill development based on Yoga, ethics, and consciousness studies",
  "Promote well-being through preventive, lifestyle-oriented approaches",
  "Research and document indigenous knowledge systems responsibly",
  "Develop ethical technologies that protect and support people",
  "Encourage sustainable living and indigenous production",
  "Operate inclusively—open to all backgrounds",
];

const financialBulletPoints = [
  "Annual reports",
  "Governance policies",
  "Financial summaries (where applicable)",
  "Program outcomes (without inflated claims)",
];

const profileDetails = [
  {
    _id: 1,
    name: "PANKAJ K TYAGI",
    position: "Founder & Visionary",
    description: `"Building a future-proof community is a systems challenge. We connect ancient wisdom with modern tools so every family can stand safe, informed, and proud."`,
    image: pankaj,
    url: "",
    items: {
      "YEARS SERVICE": "20+",
      IMPACT: "Global",
    },
  },
  {
    _id: 2,
    name: "DR. VINEETA KAPOOR",
    position: "Global Ambassador",
    description: `"We elevate education and representation so the next generation can lead with confidence, dignity, and a clear sense of identity."`,
    image: vineeta,
    url: "",
    items: {
      Education: "PhD",
      Advocacy: "Global",
    },
  },
];

const portraitImg = [portrait1, portrait2, portrait3];

export {
  aboutGridContent,
  cardBulletPoints,
  missionBulletPoints,
  financialBulletPoints,
  profileDetails,
  portraitImg,
};
