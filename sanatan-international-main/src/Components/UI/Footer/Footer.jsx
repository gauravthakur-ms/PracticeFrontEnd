import React from "react";
import logo from "../../../assets/logo.png";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter, FaSquareYoutube } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";

const Footer = () => {
  const navItems = [
    {
      name: "The Hub",
      items: [
        { name: "About the Centre", link: "about" },
        { name: "Vision & Mission", link: "vision" },
        { name: "Founders & Advisors", link: "founders" },
        { name: "Financial Reports", link: "financial-reports" },
        { name: "Collabrations", link: "collabrations" },
      ],
    },
    {
      name: "Gurukul",
      items: [
        { name: "The Foundation", link: "land-acquisition" },
        { name: "Gurukul Training", link: "gurukul-training" },
        { name: "Programs Overview", link: "courses" },
        { name: "Ayurveda Research", link: "ayurveda" },
        { name: "E-books Library", link: "ebooks" },
        { name: "Digital Scriptures", link: "library" },
      ],
    },
    {
      name: "Resources",
      items: [
        { name: "Digital Welfare Suite", link: "apps" },
        { name: "Volunteer Program", link: "volunteer" },
        { name: "Events Calendar", link: "events" },
      ],
    },
    {
      name: "Newsroom",
      items: [
        { name: "Official Blog", link: "blog" },
        { name: "Media & Press", link: "media" },
        { name: "Impact Stories", link: "testimonials" },
        { name: "FAQs", link: "faqs" },
      ],
    },
  ];

  const navigate = useNavigate();
  const navigateToLink = (link) => {
    navigate(`/${link}`);
    window.scrollTo(0, 0);
  };
  return (
    <footer className="bg-slate-950 pt-20 pb-10 px-6 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
        <div className="lg:col-span-2 pr-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/10 w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={logo} alt="Sanatan Logo" loading="lazy" />
            </div>
            <span className="text-white leading-tight">
              <span className="block font-bold text-xl tracking-tighter font-ancient">
                SANATAN
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.35em] text-orange-300/80">
                INTERNATIONAL
              </span>
            </span>
          </div>
          <p className="text-sm font-serif-elegant italic leading-relaxed mb-8 max-w-xs text-slate-500">
            "Preserving ancient heritage through futuristic AI and community
            organized welfare. Standing together for the welfare of all."
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors">
              Marketplace
              <span className="text-xs">→</span>
            </button>
          </div>
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/sanataninternational"
              target="_blank"
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-orange-500 transition-all cursor-pointer text-white/50 hover:text-white"
            >
              <FaFacebookSquare size={18} />
            </a>
            <a
              href="https://www.instagram.com/sanataninternational.usa"
              target="_blank"
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-orange-500 transition-all cursor-pointer text-white/50 hover:text-white"
            >
              <FaInstagramSquare size={18} />
            </a>
            <a
              href="https://x.com/sanatanint"
              target="_blank"
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-orange-500 transition-all cursor-pointer text-white/50 hover:text-white"
            >
              <FaSquareXTwitter size={18} />
            </a>
            <a
              href="https://www.youtube.com/@SanatanInternational.official"
              target="_blank"
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-orange-500 transition-all cursor-pointer text-white/50 hover:text-white"
            >
              <FaSquareYoutube size={18} />
            </a>
          </div>
        </div>
        <>
          {navItems.map((section, index) => (
            <div key={index}>
              <p className="text-white font-bold uppercase tracking-widest text-[10px] mb-6 opacity-80">
                {section.name}
              </p>
              <ul className="space-y-3 text-[11px] font-medium tracking-wide">
                {section.items.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => navigateToLink(item.link)}
                    className="hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-600">
        <p>Â© 2026. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="hover:text-orange-400 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-orange-400 transition-colors">
            Terms of Service
          </Link>
          <Link to="/cookie-policy" className="hover:text-orange-400 transition-colors">
            Cookie Policy
          </Link>
          <Link to="/accessibility" className="hover:text-orange-400 transition-colors">
            Accessibility
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
