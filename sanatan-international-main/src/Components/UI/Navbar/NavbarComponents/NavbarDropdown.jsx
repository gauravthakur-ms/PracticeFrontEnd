import { Link } from "react-router-dom";

const NavbarDropdown = ({ items }) => {
  return (
    <div className="absolute top-full -left-4 w-72 bg-white shadow-xl rounded-2xl p-6 border border-slate-100 mt-2">
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-4">
        {items?.heading}
      </h3>
      <ul className="flex flex-col gap-4">
        {items?.items?.map((item, index) => (
          <li key={index}>
            <Link
              to={item?.link}
              className="group text-left text-[11px] font-bold text-slate-500 hover:text-orange-600 hover:translate-x-1 transition-all flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:bg-orange-500"></span>
              {item?.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavbarDropdown;
