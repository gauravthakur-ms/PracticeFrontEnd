import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F3] flex items-center justify-center px-4 pt-28 pb-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-100 p-8">
        <Link to="/" className="block text-center font-ancient text-orange-500 text-xl mb-2">
          Sanatan International
        </Link>
        <h1 className="text-2xl font-serif-elegant text-slate-800 text-center mb-1">{title}</h1>
        {subtitle && (
          <p className="text-sm text-slate-500 text-center mb-6">{subtitle}</p>
        )}
        {children}
        {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
      </div>
    </div>
  );
}
