import React, { use, useEffect, useRef, useState } from "react";
import logo from "../../../assets/logo.png";
import "./Navbar.css";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineMenu } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import NavbarDropdown from "./NavbarComponents/NavbarDropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    {
      name: "The Hub",
      heading: "Start here for vision, accountability, and governance.",
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
      heading: "Education, research, and ethical technology programs.",
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
      heading: "Community services, resources, and volunteer efforts.",
      items: [
        { name: "Digital Welfare Suite", link: "apps" },
        { name: "Volunteer Program", link: "volunteer" },
        { name: "Events Calendar", link: "events" },
      ],
    },
    {
      name: "Newsroom",
      heading: "Stories, announcements, and official updates.",
      items: [
        { name: "Official Blog", link: "blog" },
        { name: "Media & Press", link: "media" },
        { name: "Impact Stories", link: "testimonials" },
        { name: "FAQs", link: "faqs" },
      ],
    },
  ];

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [isbackdropVisible, setIsBackdropVisible] = useState(true);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigate = useNavigate();
  const navigateToMarketplace = () => {
    navigate("/marketplace");
    window.scrollTo(0, 0);
  };
  const navigateToDonate = () => {
    navigate("/donate");
    window.scrollTo(0, 0);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMobileDropdown = (index) => {
    if (activeMobileDropdown === index) {
      setActiveMobileDropdown(null);
    } else {
      setActiveMobileDropdown(index);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
        setActiveMobileDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const location = useLocation().pathname;
  useEffect(() => {
    if (location !== "/") {
      setIsBackdropVisible(false);
    }
  }, [location]);

  return (
    <header
      className={`fixed top-15 md:top-9.5 w-full z-800 transition-all duration-700 ${isbackdropVisible?(isScrolled ? "glass-nav py-3 shadow-lg backdrop-blur-md" : "bg-transparent py-6"):("bg-white/90 py-3 shadow-lg backdrop-blur-md")} `}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* logo part */}
        <Link to="/" className="flex items-center gap-4 group cursor-pointer">
          <div className="bg-white/80 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg border border-white/60 overflow-hidden">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-bold text-lg tracking-tighter leading-none font-ancient ${isbackdropVisible?(isScrolled ? "text-slate-900" : "text-white"):"text-slate-900"}`}
            >
              SANATAN
            </span>
            <span
              className={`text-[8px] font-black tracking-[0.3em] uppercase ${isbackdropVisible?(isScrolled ? "text-orange-600" : "text-white/80"):"text-orange-600"}`}
            >
              INTERNATIONAL
            </span>
          </div>
        </Link>
        {/* content part */}
        <ul className="hidden lg:flex items-center gap-8">
          {navItems.map((item, index) => (
            <li
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
              key={index}
              className={`relative text-[10px] tracking-widest font-semibold cursor-pointer transition-colors duration-300 ${isbackdropVisible?(isScrolled ? "text-slate-600 hover:text-orange-500" : "text-white/90 hover:text-white"):"text-slate-600 hover:text-orange-500"}`}
            >
              <span className="uppercase">{item?.name}</span>
              <IoIosArrowDown className="inline-block h-3 w-3 ml-1" />
              {/* dropdown */}
              {activeDropdown === index && <NavbarDropdown items={item} />}
            </li>
          ))}
          <li
            className={`w-px h-6 mx-2  ${isbackdropVisible?(isScrolled ? "bg-slate-400" : "bg-white/30") : "bg-slate-400"}`}
          ></li>
          <button
            onClick={navigateToMarketplace}
            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${isbackdropVisible?(isScrolled ? "text-slate-600 border-slate-200 hover:text-orange-500 hover:border-orange-500" : "text-white border-white/40 hover:border-white"):"text-slate-600 border-slate-200 hover:text-orange-500 hover:border-orange-500"}`}
          >
            Marketplace
          </button>
          <button
            onClick={navigateToDonate}
            className="shimmer bg-orange-500 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:shadow-lg transition-all"
          >
            Donate
          </button>
        </ul>
        {/* mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className={`lg:hidden relative w-9 h-9 flex items-center justify-center transition-colors ${
            isScrolled ? "text-slate-600" : "text-white"
          } hover:text-orange-500`}
        >
          {/* Menu icon */}
          <HiOutlineMenu
            size={20}
            className={`absolute transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? "opacity-0 scale-75 rotate-45"
                : "opacity-100 scale-100 rotate-0"
            }`}
          />

          {/* Close icon */}
          <RxCross2
            size={20}
            className={`absolute transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-75 -rotate-45"
            }`}
          />
        </button>
        {/* mobile menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className={`absolute top-[80%] inset-x-6 rounded-xl bg-white/90 backdrop-blur-md shadow-lg pb-4 lg:hidden
            transition-all duration-300 ease-out max-h-[calc(100dvh-120px)] overflow-y-auto overscroll-contain
            ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-2 scale-100 pointer-events-auto"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            }`}
          >
            <ul className="flex flex-col items-start ">
              <div className="w-full">
                {navItems.map((item, index) => (
                  <div key={index} className="w-full">
                    <li
                      onClick={() => handleMobileDropdown(index)}
                      className={`py-4 px-6 border-b border-b-slate-700 w-full flex justify-between items-center ${index == activeMobileDropdown ? "text-orange-500" : "text-slate-600"} font-semibold text-sm capitalize tracking-wider`}
                    >
                      {item.name}
                      <IoIosArrowDown
                        className={`h-5 w-5 transition-transform duration-300 ${
                          activeMobileDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </li>
                    {activeMobileDropdown === index && (
                      <div className="bg-slate-100 w-full">
                        {item.items.map((subItem, subIndex) => (
                          <li
                            onClick={() => navigate(subItem.link)}
                            key={subIndex}
                            className="py-2 px-6 border-b border-b-slate-400 text-slate-700 text-sm capitalize tracking-wider"
                          >
                            {subItem.name}
                          </li>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 px-6 w-full flex  gap-4">
                <button
                  onClick={navigateToMarketplace}
                  className="text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full border transition-all text-slate-600 border-slate-400 hover:text-orange-500 hover:border-orange-300"
                >
                  Marketplace
                </button>
                <button
                  onClick={navigateToDonate}
                  className="shimmer bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-wider hover:bg-orange-600 hover:shadow-lg transition-all"
                >
                  Donate
                </button>
              </div>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
